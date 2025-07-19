package com.crcafe.api.dto.response;

import com.crcafe.core.model.Item;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemResponseDto {
    private Long id;
    private Item item; // It's generally safe to expose the full Item object
    private int quantity;
    private BigDecimal price;
}