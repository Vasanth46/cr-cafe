package com.crcafe.api.dto;

import com.crcafe.core.model.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateUserRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @NotNull
    private UserRole role;
    private String profileImageUrl; // Can be null
}

