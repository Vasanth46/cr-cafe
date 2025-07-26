package com.crcafe.api.dto.response;

import com.crcafe.core.model.PaymentMode;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BillResponseDto {
    private Long id;
    private OrderResponseDto order; // Uses the safe Order DTO
    private LocalDateTime billDate;
    private BigDecimal totalAmount;
    private BigDecimal discount;
    private BigDecimal finalAmount;
    private String receiptId;
    private PaymentMode paymentMode;
}