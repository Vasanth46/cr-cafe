package com.crcafe.core.repository;

import com.crcafe.core.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entities.
 * Spring Data JPA will automatically implement this interface.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Custom method to find a user by their username.
     * Spring Data JPA will automatically generate the query for this method
     * based on the method name.
     *
     * @param username The username to search for.
     * @return An Optional containing the User if found, otherwise empty.
     */
    Optional<User> findByUsername(String username);
}