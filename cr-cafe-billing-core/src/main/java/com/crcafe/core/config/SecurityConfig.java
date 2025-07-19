package com.crcafe.core.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuration class for security-related beans.
 */
@Configuration
public class SecurityConfig {

    /**
     * Creates a PasswordEncoder bean that will be used for hashing passwords.
     * BCrypt is a strong, widely-used hashing algorithm.
     * @return A PasswordEncoder instance.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
