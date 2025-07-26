package com.crcafe.api.controller;

import com.crcafe.api.config.ApiPaths;
import com.crcafe.api.dto.OrderRequestDto;
import com.crcafe.api.dto.response.BillResponseDto;
import com.crcafe.api.dto.response.OrderItemResponseDto;
import com.crcafe.api.dto.response.OrderResponseDto;
import com.crcafe.api.dto.response.UserResponseDto;
import com.crcafe.core.model.Bill;
import com.crcafe.core.model.Item;
import com.crcafe.core.model.Order;
import com.crcafe.core.model.OrderItem;
import com.crcafe.core.model.PaymentMode;
import com.crcafe.core.model.User;
import com.crcafe.core.repository.UserRepository;
import com.crcafe.core.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping(ApiPaths.ORDERS_ROOT)
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository; // Inject UserRepository

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'WORKER')")
    public ResponseEntity<OrderResponseDto> createOrder(@RequestBody @Valid OrderRequestDto orderRequestDto) {
        List<OrderItem> orderItems = orderRequestDto.getItems().stream().map(dto -> {
            OrderItem orderItem = new OrderItem();
            Item item = new Item();
            item.setId(dto.getItemId());
            orderItem.setItem(item);
            orderItem.setQuantity(dto.getQuantity());
            return orderItem;
        }).collect(Collectors.toList());

        Order createdOrder = orderService.createOrder(orderItems, orderRequestDto.getUserId());
        return ResponseEntity.ok(toOrderResponseDto(createdOrder));
    }

    @PostMapping("/{orderId}/bill")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BillResponseDto> generateBill(
            @PathVariable Long orderId, 
            @RequestParam(required = false) Long discountId,
            @RequestParam(defaultValue = "CASH") PaymentMode paymentMode) {
        Bill bill = orderService.generateBill(orderId, discountId, paymentMode);
        return ResponseEntity.ok(toBillResponseDto(bill));
    }

    @GetMapping(ApiPaths.ORDERS_TODAY_COUNT)
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<Long> getTodaysOrderCount() {
        // Safely get the username from the security context
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        // Fetch the user entity from the repository
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        long count = orderService.getTodaysOrderCountForUser(currentUser.getId());
        return ResponseEntity.ok(count);
    }

    @GetMapping(ApiPaths.ORDERS_MY_DAY_COUNT)
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER', 'WORKER')")
    public ResponseEntity<Long> getMyTodaysOrderCount() {
        // Safely get the username from the security context
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        // Fetch the user entity from the repository
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        long count = orderService.getTodaysOrderCountForUser(currentUser.getId());
        return ResponseEntity.ok(count);
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
        dto.setPaymentMode(bill.getPaymentMode());
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
