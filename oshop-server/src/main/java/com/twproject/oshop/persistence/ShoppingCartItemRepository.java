package com.twproject.oshop.persistence;

import com.twproject.oshop.model.ShoppingCartItem;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShoppingCartItemRepository extends CrudRepository<ShoppingCartItem, Long> {
    Optional<ShoppingCartItem> findById(Long orderId);

    Optional<List<ShoppingCartItem>> findAllByOrderId(Long orderId);
}
