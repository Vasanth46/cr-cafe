package com.crcafe.api.controller;

import com.crcafe.api.dto.UserDto;
import com.crcafe.api.dto.response.UserResponseDto;
import com.crcafe.core.model.User;
import com.crcafe.core.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<UserResponseDto> createUser(@Valid @RequestBody UserDto userDto) {
        User newUser = userService.createUser(userDto.getUsername(), userDto.getPassword(), userDto.getRole());
        // Convert the User entity to a safe DTO before returning
        return ResponseEntity.ok(toUserResponseDto(newUser));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        // Convert the list of User entities to a list of safe DTOs
        List<UserResponseDto> userDtos = users.stream()
                .map(this::toUserResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    // Helper method to convert User entity to UserResponseDto
    private UserResponseDto toUserResponseDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        return dto;
    }
}