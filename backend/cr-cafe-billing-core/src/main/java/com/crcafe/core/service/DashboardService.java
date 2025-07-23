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
    List<Map<String,Object>> getUsersPerformance(String range);
}