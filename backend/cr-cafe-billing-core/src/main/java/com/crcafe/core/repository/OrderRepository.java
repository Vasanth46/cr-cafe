package com.crcafe.core.repository;

import com.crcafe.core.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    long countByOrderDateBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT u.username AS username, COUNT(o) AS orders FROM Order o JOIN o.user u WHERE o.orderDate >= :startDate AND o.orderDate <= :endDate GROUP BY u.username")
    List<UserOrderCountProjection> findUserOrderCounts(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("""
        SELECT u.username AS username, COUNT(o.id) AS orders
        FROM Order o
        JOIN o.user u
        WHERE DATE(o.orderDate) = CURRENT_DATE
        GROUP BY u.username
    """)
    List<UserOrderCountProjection> getOrdersGroupedByUserForToday();

    @Query("""
        SELECT u.username AS username, COUNT(o.id) AS orders
        FROM Order o
        JOIN o.user u
        WHERE FUNCTION('YEARWEEK', o.orderDate, 1) = FUNCTION('YEARWEEK', CURRENT_DATE, 1)
        GROUP BY u.username
    """)
    List<UserOrderCountProjection> getOrdersGroupedByUserForThisWeek();

    @Query("""
        SELECT u.username AS username, COUNT(o.id) AS orders
        FROM Order o
        JOIN o.user u
        WHERE MONTH(o.orderDate) = MONTH(CURRENT_DATE) AND YEAR(o.orderDate) = YEAR(CURRENT_DATE)
        GROUP BY u.username
    """)
    List<UserOrderCountProjection> getOrdersGroupedByUserForThisMonth();

    Optional<Order> findById(Long id);

    List<Order> findAllByOrderByOrderDateDesc();

    // Query to count orders for a specific user on a specific day
    @Query("SELECT count(o) FROM Order o WHERE o.user.id = :userId AND o.orderDate >= :startOfDay AND o.orderDate <= :endOfDay")
    long countByUserIdAndOrderDateBetween(
        @Param("userId") Long userId, 
        @Param("startOfDay") LocalDateTime startOfDay, 
        @Param("endOfDay") LocalDateTime endOfDay
    );
}