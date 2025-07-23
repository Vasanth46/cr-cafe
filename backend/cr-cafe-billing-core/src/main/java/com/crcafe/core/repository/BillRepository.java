package com.crcafe.core.repository;

import com.crcafe.core.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    @Query(value = "SELECT o.user_id, u.username AS handled_by, b.order_id, b.receipt_id, " +
            "b.final_amount, b.bill_date AS date " +
            "FROM bills b " +
            "JOIN orders o ON b.order_id = o.id " +
            "JOIN users u ON o.user_id = u.id " +
            "ORDER BY b.bill_date DESC " +
            "LIMIT 10",
            nativeQuery = true)
    List<Object[]> fetchRecentTransactions();
}
