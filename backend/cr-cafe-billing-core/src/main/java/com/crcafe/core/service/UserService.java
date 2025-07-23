package com.crcafe.core.service;

import com.crcafe.core.model.User;
import com.crcafe.core.model.UserRole;
import java.util.List;
import java.util.Optional;

/**
 * Interface for user management operations.
 */
public interface UserService {
    User createUser(String username, String password, UserRole role, String profileImageUrl);
    Optional<User> findByUsername(String username);
    List<User> findAllUsers();
    void deleteUser(Long userId);
     void saveUserRefreshToken(String username, String refreshToken);

}
