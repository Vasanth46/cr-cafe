package com.crcafe.core.service.impl;

import com.crcafe.core.model.*;
import com.crcafe.core.repository.*;
import com.crcafe.core.service.OrderService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final BillRepository billRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final DiscountRepository discountRepository;

    public OrderServiceImpl(OrderRepository orderRepository, BillRepository billRepository, UserRepository userRepository, ItemRepository itemRepository, DiscountRepository discountRepository) {
        this.orderRepository = orderRepository;
        this.billRepository = billRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.discountRepository = discountRepository;
    }

    @Override
    @Transactional
    public Order createOrder(List<OrderItem> orderItems, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        Order order = new Order();
        order.setUser(user);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItem orderItem : orderItems) {
            Item item = itemRepository.findById(orderItem.getItem().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Item not found with id: " + orderItem.getItem().getId()));

            if (!item.isAvailable()) {
                throw new IllegalStateException("Item " + item.getName() + " is not available.");
            }

            orderItem.setOrder(order);
            orderItem.setItem(item);
            orderItem.setPrice(item.getPrice());
            totalAmount = totalAmount.add(item.getPrice().multiply(new BigDecimal(orderItem.getQuantity())));
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Bill generateBill(Long orderId, Long discountId, PaymentMode paymentMode) {
        if (findBillByOrderId(orderId).isPresent()) {
            throw new IllegalStateException("A bill for order ID " + orderId + " has already been generated.");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + orderId));

        Bill bill = new Bill();
        bill.setOrder(order);
        bill.setTotalAmount(order.getTotalAmount());
        bill.setPaymentMode(paymentMode);

        BigDecimal discountPercentage = BigDecimal.ZERO;
        if (discountId != null) {
            Discount discount = discountRepository.findById(discountId)
                    .orElseThrow(() -> new EntityNotFoundException("Discount not found with id: " + discountId));
            if (discount.isActive()) {
                discountPercentage = discount.getPercentage();
            }
        }

        BigDecimal discountAmount = order.getTotalAmount()
                .multiply(discountPercentage)
                .divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);

        bill.setDiscount(discountAmount);
        bill.setFinalAmount(order.getTotalAmount().subtract(discountAmount));

        // --- START OF ROBUST RECEIPT ID LOGIC ---
        // Format: YYYYMMDD-HHMMSS-8_CHAR_RANDOM
        String timestampPart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        String randomPart = UUID.randomUUID().toString().toUpperCase().substring(0, 8);
        bill.setReceiptId("CRCAFE-" + timestampPart + "-" + randomPart);
        // --- END OF ROBUST RECEIPT ID LOGIC ---

        return billRepository.save(bill);
    }

    @Override
    public Optional<Bill> findBillByOrderId(Long orderId) {
        return billRepository.findByOrderId(orderId);
    }

    @Override
    public long getTodaysOrderCountForUser(Long userId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        return orderRepository.countByUserIdAndOrderDateBetween(userId, startOfDay, endOfDay);
    }
}
