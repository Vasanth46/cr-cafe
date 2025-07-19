// File: cr-cafe-billing-core/src/main/java/com/crcafe/core/service/DatabaseSeeder.java
package com.crcafe.core.service;

import com.crcafe.core.model.User;
import com.crcafe.core.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;

/**
 * This component runs on application startup. It checks for users with plain-text
 * passwords and hashes them securely. This is a robust way to seed initial user data.
 */
@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- Running Database Seeder ---");
        List<User> users = userRepository.findAll();

        for (User user : users) {
            // Check if the password is not already hashed (BCrypt hashes start with $2a$, $2b$, or $2y$)
            if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
                System.out.println("Found plain-text password for user: " + user.getUsername() + ". Hashing now.");
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userRepository.save(user);
                System.out.println("Password for " + user.getUsername() + " has been hashed and updated.");
            }
        }
        System.out.println("--- Database Seeder Finished ---");
    }
}
