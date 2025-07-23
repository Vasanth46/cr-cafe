package com.crcafe.api.controller;

import com.crcafe.api.dto.CreateUserRequest;
import com.crcafe.api.dto.UserDto;
import com.crcafe.api.dto.response.UserResponseDto;
import com.crcafe.core.model.User;
import com.crcafe.core.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<UserResponseDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        User newUser = userService.createUser(
                request.getUsername(),
                request.getPassword(),
                request.getRole(),
                request.getProfileImageUrl()
        );
        UserResponseDto responseDto = new UserResponseDto(
                newUser.getId(),
                newUser.getUsername(),
                newUser.getRole(),
                newUser.getProfileImageUrl()
        );
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }


    @GetMapping
    @PreAuthorize("hasRole('OWNER')")
    public List<UserResponseDto> getAllUsers() {
        return userService.findAllUsers().stream()
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getUsername(),
                        user.getRole(), // Pass the UserRole enum directly
                        user.getProfileImageUrl()
                ))
                .collect(Collectors.toList());
    }


}