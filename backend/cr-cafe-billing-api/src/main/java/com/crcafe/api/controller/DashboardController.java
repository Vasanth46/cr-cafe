package com.crcafe.api.controller;

import com.crcafe.core.dto.DashboardSummaryDto;
import com.crcafe.core.repository.UserOrderCountProjection;
import com.crcafe.core.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<DashboardSummaryDto> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/top-items")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Map<String, Object>>> getTopItems() {
        return ResponseEntity.ok(dashboardService.getTopItems());
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Map<String, Object>>> getRevenue(@RequestParam(defaultValue = "day") String range) {
        return ResponseEntity.ok(dashboardService.getRevenue(range));
    }

    @GetMapping("/recent-transactions")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Map<String, Object>>> getRecentTransactions() {
        return ResponseEntity.ok(dashboardService.getRecentTransactions());
    }
    @GetMapping("/recent-transactions/paginated")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getRecentTransactionsPaginated(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(dashboardService.getRecentTransactionsPaginated(page, size));
    }
    @GetMapping("/recent-transactions/filtered")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getRecentTransactionsWithFilters(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String cashier,
            @RequestParam(required = false) java.math.BigDecimal minValue,
            @RequestParam(required = false) java.math.BigDecimal maxValue,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String paymentMode) {
        
        java.time.LocalDateTime startDateTime = null;
        java.time.LocalDateTime endDateTime = null;
        
        if (startDate != null && !startDate.isEmpty()) {
            startDateTime = java.time.LocalDate.parse(startDate).atStartOfDay();
        }
        if (endDate != null && !endDate.isEmpty()) {
            endDateTime = java.time.LocalDate.parse(endDate).atTime(23, 59, 59);
        }
        
        return ResponseEntity.ok(dashboardService.getRecentTransactionsWithFilters(
            page, size, cashier, minValue, maxValue, startDateTime, endDateTime, paymentMode));
    }

    @GetMapping("/cashiers")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<String>> getAllCashiers() {
        return ResponseEntity.ok(dashboardService.getAllCashiers());
    }
    @GetMapping("/users-performance")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Map<String,Object>>> getUserPerformance(
            @RequestParam(defaultValue = "day") String range) {
        return ResponseEntity.ok(dashboardService.getUsersPerformance(range));
    }

    @GetMapping("/todays-revenue-by-payment-mode")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, String>> getTodaysRevenueByPaymentMode() {
        System.out.println("Getting today's revenue by payment mode");
        Map<String, java.math.BigDecimal> revenue = dashboardService.getTodaysRevenueByPaymentMode();
        Map<String, String> result = new java.util.HashMap<>();
        for (Map.Entry<String, java.math.BigDecimal> entry : revenue.entrySet()) {
            result.put(entry.getKey(), entry.getValue().toPlainString());
        }
        System.out.println("Result: " + result);
        return ResponseEntity.ok(result);
    }
} 