package com.crcafe.api.dto.response;

import com.crcafe.core.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A safe DTO for representing a User in API responses.
 * Notice it does NOT contain the password field.
 */
@Data
@NoArgsConstructor // Add this for default constructor
public class UserResponseDto {
    private Long id;
    private String username;
    private UserRole role;
    private String profileImageUrl; // Ensure this field exists

    // This constructor is crucial for mapping the data correctly
    public UserResponseDto(Long id, String username, UserRole role, String profileImageUrl) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.profileImageUrl = profileImageUrl;
    }
}
