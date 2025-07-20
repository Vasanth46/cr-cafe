package com.crcafe.api.controller;

import com.crcafe.api.dto.LoginRequest;
import com.crcafe.api.dto.LoginResponse;
import com.crcafe.api.security.JwtUtil;
import com.crcafe.core.model.User; // Import User model
import com.crcafe.core.service.UserService; // Import UserService
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService; // <-- INJECT THE USER SERVICE

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService; // <-- INITIALIZE IT
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@Valid @RequestBody LoginRequest loginRequest) throws Exception {
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

        final String jwt = jwtUtil.generateToken(userDetails);

        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("");

        // Pass the user's ID into the response
        return ResponseEntity.ok(new LoginResponse(jwt, user.getId(), userDetails.getUsername(), role));
    }
}
