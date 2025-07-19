package com.crcafe.core.repository;

import com.crcafe.core.model.FinancialSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FinancialSummaryRepository extends JpaRepository<FinancialSummary, Long> {
}