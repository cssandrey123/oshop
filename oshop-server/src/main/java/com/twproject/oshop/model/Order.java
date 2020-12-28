package com.twproject.oshop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "ORDERS")
public class Order {
    @Id
    @Column(name = "ORDER_ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "PLACED_DATE")
    private Date placedDate;
}
