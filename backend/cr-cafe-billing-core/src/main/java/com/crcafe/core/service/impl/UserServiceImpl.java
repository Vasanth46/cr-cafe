package com.crcafe.core.service.impl;

import com.crcafe.core.model.User;
import com.crcafe.core.model.UserRole;
import com.crcafe.core.repository.UserRepository;
import com.crcafe.core.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service // Marks this as a Spring service component
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Dependency injection of the repository and password encoder
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

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
        user.setRole(role);
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
}