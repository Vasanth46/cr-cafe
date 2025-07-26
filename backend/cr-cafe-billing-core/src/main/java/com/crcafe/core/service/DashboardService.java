package com.crcafe.core.service;

import com.crcafe.core.dto.DashboardSummaryDto;
import com.crcafe.core.repository.UserOrderCountProjection;

import java.util.List;
import java.util.Map;

public interface DashboardService {
    DashboardSummaryDto getSummary();
    List<Map<String, Object>> getTopItems();
    List<Map<String, Object>> getRevenue(String range);
    List<Map<String, Object>> getRecentTransactions();
    Map<String, Object> getRecentTransactionsPaginated(int page, int size);
    Map<String, Object> getRecentTransactionsWithFilters(int page, int size, String cashier, 
        java.math.BigDecimal minValue, java.math.BigDecimal maxValue, 
        java.time.LocalDateTime startDate, java.time.LocalDateTime endDate, String paymentMode);
    List<String> getAllCashiers();
    List<Map<String,Object>> getUsersPerformance(String range);
    // Add method to get today's revenue by payment mode
    Map<String, java.math.BigDecimal> getTodaysRevenueByPaymentMode();
}