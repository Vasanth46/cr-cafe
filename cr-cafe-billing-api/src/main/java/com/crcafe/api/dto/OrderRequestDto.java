package com.crcafe.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDto {
    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid // This annotation cascades validation to the objects inside the list
    private List<OrderItemDto> items;
}
