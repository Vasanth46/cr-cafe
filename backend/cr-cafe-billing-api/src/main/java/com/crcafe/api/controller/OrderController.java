package com.crcafe.api.controller;

import com.crcafe.api.dto.OrderRequestDto;
import com.crcafe.api.dto.response.BillResponseDto;
import com.crcafe.api.dto.response.OrderItemResponseDto;
import com.crcafe.api.dto.response.OrderResponseDto;
import com.crcafe.api.dto.response.UserResponseDto;
import com.crcafe.core.model.Bill;
import com.crcafe.core.model.Item;
import com.crcafe.core.model.Order;
import com.crcafe.core.model.OrderItem;
import com.crcafe.core.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponseDto> createOrder(@Valid @RequestBody OrderRequestDto orderRequest) {
        List<OrderItem> orderItems = orderRequest.getItems().stream().map(dto -> {
            OrderItem orderItem = new OrderItem();
            Item item = new Item();
            item.setId(dto.getItemId());
            orderItem.setItem(item);
            orderItem.setQuantity(dto.getQuantity());
            return orderItem;
        }).collect(Collectors.toList());

        Order createdOrder = orderService.createOrder(orderItems, orderRequest.getUserId());
        return ResponseEntity.ok(toOrderResponseDto(createdOrder));
    }

    @PostMapping("/{orderId}/bill")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BillResponseDto> generateBill(@PathVariable Long orderId, @RequestParam(required = false) Long discountId) {
        Bill bill = orderService.generateBill(orderId, discountId);
        return ResponseEntity.ok(toBillResponseDto(bill));
    }

    // --- Helper methods to convert entities to DTOs ---

    private BillResponseDto toBillResponseDto(Bill bill) {
        BillResponseDto dto = new BillResponseDto();
        dto.setId(bill.getId());
        dto.setOrder(toOrderResponseDto(bill.getOrder()));
        dto.setBillDate(bill.getBillDate());
        dto.setTotalAmount(bill.getTotalAmount());
        dto.setDiscount(bill.getDiscount());
        dto.setFinalAmount(bill.getFinalAmount());
        dto.setReceiptId(bill.getReceiptId());
        return dto;
    }

    private OrderResponseDto toOrderResponseDto(Order order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setUser(toUserResponseDto(order.getUser()));
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setOrderItems(order.getOrderItems().stream()
                .map(this::toOrderItemResponseDto)
                .collect(Collectors.toList()));
        return dto;
    }

    private OrderItemResponseDto toOrderItemResponseDto(OrderItem orderItem) {
        OrderItemResponseDto dto = new OrderItemResponseDto();
        dto.setId(orderItem.getId());
        dto.setItem(orderItem.getItem());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        return dto;
    }

    private UserResponseDto toUserResponseDto(com.crcafe.core.model.User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        return dto;
    }
}
