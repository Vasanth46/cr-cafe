package com.crcafe.api.controller;

import com.crcafe.api.config.ApiPaths;
import com.crcafe.api.dto.LoginRequest;
import com.crcafe.api.dto.LoginResponse;
import com.crcafe.api.security.JwtUtil;
import com.crcafe.core.model.User; // Import User model
import com.crcafe.core.service.UserService; // Import UserService
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(ApiPaths.AUTH_ROOT)
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService; // <-- INJECT THE USER SERVICE

    @PostMapping(ApiPaths.AUTH_LOGIN)
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest, HttpServletResponse response) throws Exception {
    	System.out.println("IN LOGIN");
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        final UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // --- START OF FIX ---
        // After successful authentication, fetch the full user object to get the ID
        final User user = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new Exception("User not found after authentication"));
        // --- END OF FIX ---

        // CHANGE 3: Generate BOTH an access token and a refresh token
        final String accessToken = jwtUtil.generateToken(userDetails);
        final String refreshToken = jwtUtil.generateRefreshToken(userDetails);
// --- Persist the refresh token to the database ---
        userService.saveUserRefreshToken(user.getUsername(), refreshToken);

        // CHANGE 4: Create a secure, HttpOnly cookie for the refresh token
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true); // In production, ensure you're using HTTPS
        refreshTokenCookie.setPath("/");    // Set path to root to be accessible site-wide
        refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days (must match token expiration)
        response.addCookie(refreshTokenCookie);

        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("");

        // Pass the user's ID into the response
        // REPLACE THE FINAL RETURN STATEMENT IN THE /login ENDPOINT WITH THIS
        return ResponseEntity.ok(new LoginResponse(
                accessToken,
                user.getId(),
                userDetails.getUsername(),
                role,
                user.getProfileImageUrl() // The new line
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // In a stateless JWT system, logout is handled on the client by deleting the token.
        // This endpoint exists for extensibility (e.g., token blacklist) and frontend symmetry.
        return ResponseEntity.ok().build();
    }

    @PostMapping(ApiPaths.AUTH_REFRESH)
    public ResponseEntity<?> refreshToken(@RequestBody String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token is missing.");
        }

        try {
            String username = jwtUtil.extractUsername(refreshToken);
            // Since User implements UserDetails, we can use it directly
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "User not found for token."));

            if (!refreshToken.equals(user.getRefreshToken()) || !jwtUtil.validateToken(refreshToken, user)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid or expired refresh token.");
            }

            String newAccessToken = jwtUtil.generateToken(user);

            // --- START OF FIX ---
            // Get the role as a String from the user's authorities, just like in the /login method.
            // This is possible because your User class now implements UserDetails.
            String role = user.getAuthorities().stream()
                    .findFirst()
                    .map(GrantedAuthority::getAuthority)
                    .orElse("");

            // Pass the String 'role' to the LoginResponse constructor instead of the UserRole enum.
            // REPLACE THE FINAL RETURN STATEMENT IN THE /login ENDPOINT WITH THIS
            return ResponseEntity.ok(new LoginResponse(
                    newAccessToken,
                    user.getId(),
                    user.getUsername(),
                    role,
                    user.getProfileImageUrl() // The new line
            ));
            // --- END OF FIX ---

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid refresh token.");
        }
    }
}
