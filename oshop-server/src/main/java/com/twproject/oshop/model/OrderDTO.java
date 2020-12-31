package com.twproject.oshop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import java.sql.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long userId;
    private String username;
    private Date datePlaced;
    private List<ShoppingCartItemDTO> items;
    private String shippingName;
    private String shippingAddress;
    private String shippingCity;
    private String phoneNumber;
}
