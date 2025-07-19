package com.crcafe.core.repository;

import com.crcafe.core.model.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Discount entities.
 */
@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {

    /**
     * Finds all discounts that are currently active.
     * @return A list of active discounts.
     */
    List<Discount> findByIsActiveTrue();
}