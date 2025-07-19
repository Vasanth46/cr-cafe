package com.crcafe.api.dto.response;

import com.crcafe.core.model.UserRole;
import lombok.Data;

/**
 * A safe DTO for representing a User in API responses.
 * Notice it does NOT contain the password field.
 */
@Data
public class UserResponseDto {
    private Long id;
    private String username;
    private UserRole role;
}