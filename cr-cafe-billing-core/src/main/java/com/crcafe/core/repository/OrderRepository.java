package com.crcafe.core.repository;

import com.crcafe.core.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Order entities.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Finds all orders placed within a specific date range.
     * This will be useful for the owner's dashboard.
     * @param startDate The start of the date range.
     * @param endDate The end of the date range.
     * @return A list of orders within the given dates.
     */
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}