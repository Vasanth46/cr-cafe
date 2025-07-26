package com.crcafe.core.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_summary")
@Data
@NoArgsConstructor
public class FinancialSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime archivedDate;
    private LocalDateTime originalBillDate;
    private BigDecimal totalAmount;
    private BigDecimal discount;
    private BigDecimal finalAmount;
    private String receiptId;
    private BigDecimal totalRevenue;
    private BigDecimal totalDiscount;
    private long totalOrders;

    public FinancialSummary(BigDecimal totalRevenue, BigDecimal totalDiscount, long totalOrders) {
        this.totalRevenue = totalRevenue;
        this.totalDiscount = totalDiscount;
        this.totalOrders = totalOrders;
    }
}