package com.crcafe.core.repository;

import com.crcafe.core.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List; // Import List
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    void deleteByBillDateBefore(LocalDateTime cutoffDate);
    Optional<Bill> findByOrderId(Long orderId);

    // Add this method to find all bills before a certain date
    List<Bill> findByBillDateBefore(LocalDateTime cutoffDate);

    List<Bill> findByBillDateBetween(LocalDateTime start, LocalDateTime end);

    @Query(value = "SELECT o.user_id, u.username AS handled_by, b.order_id, b.receipt_id, " +
            "b.final_amount, b.bill_date AS date " +
            "FROM bills b " +
            "JOIN orders o ON b.order_id = o.id " +
            "JOIN users u ON o.user_id = u.id " +
            "ORDER BY b.bill_date DESC " +
            "LIMIT 10",
            nativeQuery = true)
    List<Object[]> fetchRecentTransactions();

    @Query(value = "SELECT o.user_id, u.username AS handled_by, b.order_id, b.receipt_id, " +
            "b.final_amount, b.bill_date AS date, b.payment_mode " +
            "FROM bills b " +
            "JOIN orders o ON b.order_id = o.id " +
            "JOIN users u ON o.user_id = u.id " +
            "ORDER BY b.bill_date DESC " +
            "LIMIT :limit OFFSET :offset",
            nativeQuery = true)
    List<Object[]> fetchRecentTransactionsPaginated(@Param("limit") int limit, @Param("offset") int offset);

    @Query(value = "SELECT COUNT(*) FROM bills b " +
            "JOIN orders o ON b.order_id = o.id " +
            "JOIN users u ON o.user_id = u.id",
            nativeQuery = true)
    long countTotalTransactions();

    @Query(value = "SELECT o.user_id, u.username AS handled_by, b.order_id, b.receipt_id, " +
            "b.final_amount, b.bill_date AS date, b.payment_mode " +
            "FROM bills b " +
            "JOIN orders o ON b.order_id = o.id " +
            "JOIN users u ON o.user_id = u.id " +
            "WHERE (:cashier IS NULL OR u.username = :cashier) " +
            "AND (:minValue IS NULL OR b.final_amount >= :minValue) " +
            "AND (:maxValue IS NULL OR b.final_amount <= :maxValue) " +
            "AND (:startDate IS NULL OR b.bill_date >= :startDate) " +
            "AND (:endDate IS NULL OR b.bill_date <= :endDate) " +
            "AND (:paymentMode IS NULL OR b.payment_mode = :paymentMode) " +
            "ORDER BY b.bill_date DESC " +
            "LIMIT :limit OFFSET :offset",
            nativeQuery = true)
    List<Object[]> fetchRecentTransactionsWithFilters(
            @Param("cashier") String cashier,
            @Param("minValue") java.math.BigDecimal minValue,
            @Param("maxValue") java.math.BigDecimal maxValue,
            @Param("startDate") java.time.LocalDateTime startDate,
            @Param("endDate") java.time.LocalDateTime endDate,
            @Param("paymentMode") String paymentMode,
            @Param("limit") int limit,
            @Param("offset") int offset);

    @Query(value = "SELECT COUNT(*) FROM bills b " +
            "JOIN orders o ON b.order_id = o.id " +
            "JOIN users u ON o.user_id = u.id " +
            "WHERE (:cashier IS NULL OR u.username = :cashier) " +
            "AND (:minValue IS NULL OR b.final_amount >= :minValue) " +
            "AND (:maxValue IS NULL OR b.final_amount <= :maxValue) " +
            "AND (:startDate IS NULL OR b.bill_date >= :startDate) " +
            "AND (:endDate IS NULL OR b.bill_date <= :endDate) " +
            "AND (:paymentMode IS NULL OR b.payment_mode = :paymentMode)",
            nativeQuery = true)
    long countTotalTransactionsWithFilters(
            @Param("cashier") String cashier,
            @Param("minValue") java.math.BigDecimal minValue,
            @Param("maxValue") java.math.BigDecimal maxValue,
            @Param("startDate") java.time.LocalDateTime startDate,
            @Param("endDate") java.time.LocalDateTime endDate,
            @Param("paymentMode") String paymentMode);

    @Query(value = "SELECT DISTINCT u.username FROM bills b " +
            "JOIN orders o ON b.order_id = o.id " +
            "JOIN users u ON o.user_id = u.id " +
            "ORDER BY u.username",
            nativeQuery = true)
    List<String> getAllCashiers();
}
