package com.crcafe.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class DashboardSummaryDto {
    private BigDecimal totalRevenue;
    private int totalOrders;
    private BigDecimal averageBill;
    private BigDecimal totalDiscounts;
    private BigDecimal todaysRevenue;
    private int todaysOrders;
} 