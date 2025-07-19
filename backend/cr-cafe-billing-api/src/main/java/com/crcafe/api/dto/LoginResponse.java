package com.crcafe.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long id; // <-- ADD THIS FIELD
    private String username;
    private String role;
}