package com.twproject.oshop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingCartItemDTO {
    private String productTitle;
    private double productPrice;
    private int quantity;
    private double totalPrice;
}
