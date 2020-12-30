package com.twproject.oshop.service;

import com.twproject.oshop.exceptions.NotFoundException;
import com.twproject.oshop.model.ShoppingCartItem;
import com.twproject.oshop.persistence.ShoppingCartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ShoppingCartItemService {
    private ShoppingCartItemRepository shoppingCartItemRepository;

    @Autowired
    public ShoppingCartItemService(ShoppingCartItemRepository shoppingCartItemRepository) {
        this.shoppingCartItemRepository = shoppingCartItemRepository;
    }
    private ShoppingCartItem fetchShoppingCartItem(Long id) {
        Optional<ShoppingCartItem> shoppingCartItem = shoppingCartItemRepository.findById(id);
        if (shoppingCartItem.isEmpty()) {
            throw new NotFoundException();
        }
        return shoppingCartItem.get();
    }
    public ShoppingCartItem getShoppingCartItem(Long id) {
        return fetchShoppingCartItem(id);
    }

    public List<ShoppingCartItem> getShoppingCartItems() {
        List<ShoppingCartItem> shoppingCartItems = new ArrayList<ShoppingCartItem>();
        shoppingCartItemRepository.findAll().iterator().forEachRemaining(shoppingCartItems::add);
        return shoppingCartItems;
    }

    public ShoppingCartItem createShoppingCartItem(ShoppingCartItem shoppingCartItem) {
        return shoppingCartItemRepository.save(shoppingCartItem);
    }

    public void deleteShoppingCartItem(Long shoppingCartItemId) {
        shoppingCartItemRepository.deleteById(shoppingCartItemId);
    }
    public List<ShoppingCartItem> getAllByOrderId(Long orderId) {
        if (shoppingCartItemRepository.findAllByOrderId(orderId).isPresent()) {
            return shoppingCartItemRepository.findAllByOrderId(orderId).get();
        } else {
            return new ArrayList<ShoppingCartItem>();
        }
    }
}
