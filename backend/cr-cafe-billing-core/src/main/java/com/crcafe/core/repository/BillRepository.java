package com.crcafe.core.repository;

import com.crcafe.core.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
