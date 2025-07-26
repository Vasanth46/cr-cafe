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
    User findUserById(Long id);
    void deleteUser(Long id);
    User updateUser(Long id, String username, String role, String profileImageUrl);
    User getCurrentUser();
     void saveUserRefreshToken(String username, String refreshToken);

}
