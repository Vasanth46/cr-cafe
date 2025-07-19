package com.crcafe.core.repository;

import com.crcafe.core.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Item entities.
 */
@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    /**
     * Finds all items that are currently available.
     * @return A list of available items.
     */
    List<Item> findByIsAvailableTrue();
}