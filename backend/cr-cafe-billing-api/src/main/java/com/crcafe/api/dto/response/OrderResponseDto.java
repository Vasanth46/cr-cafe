package com.crcafe.api.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDto {
    private Long id;
    private UserResponseDto user; // Uses the safe User DTO
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private List<OrderItemResponseDto> orderItems;
}