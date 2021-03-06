package com.twproject.oshop.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.net.URI;
import java.net.URL;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "PRODUCTS")
public class Product {
    @Id
    @Column(name = "PRODUCT_ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, unique = true, name = "TITLE")
    private String title;

    @Column(name = "CATEGORY")
    private String category;

    @Column(name = "PRICE")
    private double price;

    @Column(name = "IMAGE_URL_HEX")
    private String imageUrlInHex;
}
