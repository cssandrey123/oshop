package com.twproject.oshop.persistence;

import com.twproject.oshop.model.Order;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends CrudRepository<Order, Long> {
    Optional<Order> findById(Long orderId);

    Optional<List<Order>> findAllByUserId(Long userId);

}
