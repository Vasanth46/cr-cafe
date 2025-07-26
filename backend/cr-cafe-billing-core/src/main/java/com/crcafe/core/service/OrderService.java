package com.crcafe.core.service;

import com.crcafe.core.model.Bill;
import com.crcafe.core.model.Order;
import com.crcafe.core.model.OrderItem;
import com.crcafe.core.model.PaymentMode;

import java.util.List;
import java.util.Optional;

/**
 * Interface for order and billing operations.
 */
public interface OrderService {
    Order createOrder(List<OrderItem> items, Long userId);
    Bill generateBill(Long orderId, Long discountId, PaymentMode paymentMode);
    Optional<Bill> findBillByOrderId(Long orderId);
    long getTodaysOrderCountForUser(Long userId);
}