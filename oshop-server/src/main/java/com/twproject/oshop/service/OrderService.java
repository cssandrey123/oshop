package com.twproject.oshop.service;

import com.twproject.oshop.exceptions.NotFoundException;
import com.twproject.oshop.model.Order;
import com.twproject.oshop.model.Status;
import com.twproject.oshop.persistence.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private OrderRepository orderRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
        List<Order> ordersToDelete = new ArrayList<>();
        orderRepository.findAll().forEach(order -> {
            if (order.getStatus() == null) {
                ordersToDelete.add(order);
            }
        });
        ordersToDelete.forEach(order -> orderRepository.delete(order));
    }

    private Order fetchOrder(Long id) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isEmpty()) {
            throw new NotFoundException();
        }
        return order.get();
    }

    public Order getOrder(Long id) {
        return fetchOrder(id);
    }

    public List<Order> getOrders() {
        List<Order> orders = new ArrayList<Order>();
        orderRepository.findAll().iterator().forEachRemaining(orders::add);
        return orders;
    }

    public List<Order> getOrdersByUserId(Long userId) {
        if (orderRepository.findAllByUserId(userId).isPresent()) {
            return orderRepository.findAllByUserId(userId).get();
        } else {
            return new ArrayList<Order>();
        }
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    public Order editOrder(Status status, Long orderId) {
        if (orderRepository.findById(orderId).isPresent()) {
            Order order = orderRepository.findById(orderId).get();
            order.setStatus(status);
            orderRepository.save(order);
            return order;
        } else {
            throw new NotFoundException();
        }
    }
}
