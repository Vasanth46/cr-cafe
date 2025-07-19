package com.crcafe.api.exception;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * A DTO to represent a structured API error response.
 */
@Data
public class ApiErrorResponse {
    private int statusCode;
    private String message;
    private LocalDateTime timestamp;
    private Map<String, List<String>> validationErrors; // Field for validation errors

    public ApiErrorResponse(int statusCode, String message, LocalDateTime timestamp) {
        this.statusCode = statusCode;
        this.message = message;
        this.timestamp = timestamp;
    }

    public ApiErrorResponse(int statusCode, String message, LocalDateTime timestamp, Map<String, List<String>> validationErrors) {
        this.statusCode = statusCode;
        this.message = message;
        this.timestamp = timestamp;
        this.validationErrors = validationErrors;
    }
}