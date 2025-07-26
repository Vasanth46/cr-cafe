package com.crcafe.core.service.impl;

import com.crcafe.core.model.User;
import com.crcafe.core.model.UserRole;
import com.crcafe.core.repository.UserRepository;
import com.crcafe.core.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service // Marks this as a Spring service component
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional // Add this annotation
    public User createUser(String username, String password, UserRole role, String profileImageUrl) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalStateException("Username already exists");
        }
        User user = new User();
        user.setUsername(username);
        // We must encode the password before saving it to the database for security
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(UserRole.valueOf(role.toString().toUpperCase()));
        user.setProfileImageUrl(profileImageUrl);
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Override
    public void saveUserRefreshToken(String username, String refreshToken) {
        userRepository.findByUsername(username).ifPresent(user -> {
            user.setRefreshToken(refreshToken);
            userRepository.save(user);
        });
    }

    @Override
    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    @Override
    public User updateUser(Long id, String username, String role, String profileImageUrl) {
        User user = findUserById(id);
        user.setUsername(username);
        user.setRole(UserRole.valueOf(role.toUpperCase()));
        user.setProfileImageUrl(profileImageUrl);
        return userRepository.save(user);
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("No authenticated user found");
        }
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        return findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database: " + username));
    }
}