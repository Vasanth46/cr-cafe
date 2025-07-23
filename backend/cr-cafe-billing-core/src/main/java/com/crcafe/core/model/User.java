package com.crcafe.core.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users") // Maps this class to the 'users' table
@Data // Lombok annotation to generate getters, setters, toString, etc.
@NoArgsConstructor // Lombok annotation for a no-argument constructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING) // Stores the enum as a String ("OWNER", "MANAGER", "WORKER")
    @Column(nullable = false)
    private UserRole role;

    @Column(name = "refresh_token", length = 512) // Choose a length that can hold a JWT
    private String refreshToken;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }
    @Override
    public boolean isAccountNonExpired() {
        return true; // Or add logic for account expiration
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Or add logic for account locking
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Or add logic for password expiration
    }

    @Override
    public boolean isEnabled() {
        return true; // Or add a field to disable users
    }
}