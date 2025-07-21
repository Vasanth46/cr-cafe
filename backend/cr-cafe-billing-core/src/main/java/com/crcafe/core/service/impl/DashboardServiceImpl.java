package com.crcafe.core.service.impl;

import com.crcafe.core.dto.DashboardSummaryDto;
import com.crcafe.core.model.Bill;
import com.crcafe.core.model.Order;
import com.crcafe.core.model.OrderItem;
import com.crcafe.core.repository.BillRepository;
import com.crcafe.core.repository.OrderItemRepository;
import com.crcafe.core.repository.OrderRepository;
import com.crcafe.core.service.DashboardService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {
    private final BillRepository billRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public DashboardServiceImpl(BillRepository billRepository, OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.billRepository = billRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Override
    public DashboardSummaryDto getSummary() {
        List<Bill> bills = billRepository.findAll();
        List<Order> orders = orderRepository.findAll();

        BigDecimal totalRevenue = bills.stream()
                .map(Bill::getFinalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int totalOrders = orders.size();
        BigDecimal averageBill = bills.isEmpty() ? BigDecimal.ZERO :
                totalRevenue.divide(BigDecimal.valueOf(bills.size()), 2, BigDecimal.ROUND_HALF_UP);
        BigDecimal totalDiscounts = bills.stream()
                .map(b -> b.getDiscount() == null ? BigDecimal.ZERO : b.getDiscount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Today's stats
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
        BigDecimal todaysRevenue = bills.stream()
                .filter(b -> b.getBillDate() != null &&
                        !b.getBillDate().isBefore(startOfDay) && !b.getBillDate().isAfter(endOfDay))
                .map(Bill::getFinalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int todaysOrders = (int) orders.stream()
                .filter(o -> o.getOrderDate() != null &&
                        !o.getOrderDate().isBefore(startOfDay) && !o.getOrderDate().isAfter(endOfDay))
                .count();

        return new DashboardSummaryDto(
                totalRevenue,
                totalOrders,
                averageBill,
                totalDiscounts,
                todaysRevenue,
                todaysOrders
        );
    }

    @Override
    public List<Map<String, Object>> getTopItems() {
        List<OrderItem> orderItems = orderItemRepository.findAll();
        Map<String, Integer> itemSales = new java.util.HashMap<>();
        for (OrderItem oi : orderItems) {
            if (oi.getItem() == null || oi.getItem().getName() == null) continue;
            String name = oi.getItem().getName();
            itemSales.put(name, itemSales.getOrDefault(name, 0) + oi.getQuantity());
        }
        return itemSales.entrySet().stream()
                .sorted((a, b) -> b.getValue() - a.getValue())
                .limit(10)
                .map(e -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("name", e.getKey());
                    map.put("sales", e.getValue());
                    return map;
                })
                .toList();
    }

    @Override
    public List<Map<String, Object>> getRevenue(String range) {
        List<Bill> bills = billRepository.findAll();
        List<Order> orders = orderRepository.findAll();
        Map<String, Map<String, Object>> result = new java.util.LinkedHashMap<>();
        java.time.format.DateTimeFormatter formatter;
        java.util.function.Function<java.time.LocalDateTime, String> labelFunc;
        if ("month".equalsIgnoreCase(range)) {
            formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM");
            labelFunc = dt -> dt.format(formatter);
        } else if ("week".equalsIgnoreCase(range)) {
            formatter = java.time.format.DateTimeFormatter.ofPattern("YYYY-'W'ww");
            labelFunc = dt -> dt.format(formatter);
        } else {
            formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
            labelFunc = dt -> dt.format(formatter);
        }
        for (Bill bill : bills) {
            if (bill.getBillDate() == null) continue;
            String label = labelFunc.apply(bill.getBillDate());
            Map<String, Object> entry = result.computeIfAbsent(label, l -> new java.util.HashMap<>());
            entry.put("label", label);
            entry.put("revenue", ((BigDecimal) entry.getOrDefault("revenue", BigDecimal.ZERO)).add(bill.getFinalAmount()));
            entry.put("orders", ((Integer) entry.getOrDefault("orders", 0)) + 1);
        }
        return new java.util.ArrayList<>(result.values());
    }

    @Override
    public List<Map<String, Object>> getRecentTransactions() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .sorted((a, b) -> b.getOrderDate().compareTo(a.getOrderDate()))
                .limit(10)
                .map(order -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("customer", order.getUser() != null ? order.getUser().getUsername() : "-");
                    map.put("items", order.getOrderItems() != null ? order.getOrderItems().stream()
                        .map(oi -> oi.getItem() != null ? oi.getItem().getName() : "-")
                        .toList() : java.util.Collections.emptyList());
                    map.put("value", order.getTotalAmount());
                    map.put("date", order.getOrderDate());
                    return map;
                })
                .toList();
    }
} 