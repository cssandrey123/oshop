package com.twproject.oshop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "CART_ITEMS")
public class ShoppingCartItem {
    @Id
    @Column(name = "CART_ITEM_ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "ORDER_ID")
    private Long orderId;

    @Column(name = "PRODUCT_ID")
    private Long productId;

    @Column(name = "QUANTITY")
    private int quantity;
}
