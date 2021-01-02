package com.twproject.oshop.api;

import com.twproject.oshop.exceptions.NotAllowedException;
import com.twproject.oshop.model.*;
import com.twproject.oshop.service.OrderService;
import com.twproject.oshop.service.ProductService;
import com.twproject.oshop.service.ShoppingCartItemService;
import com.twproject.oshop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class OrderController {
    private UserService userService;
    private ProductService productService;
    private OrderService orderService;
    private ShoppingCartItemService shoppingCartItemService;
    @Autowired
    public OrderController(UserService userService, ProductService productService, OrderService orderService, ShoppingCartItemService shoppingCartItemService) {
        this.userService = userService;
        this.productService = productService;
        this.orderService = orderService;
        this.shoppingCartItemService = shoppingCartItemService;
    }

    private static List<String> getAuthorityList(Authentication authentication) {
        return authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
    }

    private static boolean hasAuthority(Authentication authentication, String authorityName) {
        return getAuthorityList(authentication).contains(authorityName);
    }

    @PostMapping("/place-order")
    public ResponseEntity placeOrder(@RequestBody OrderDTO orderDTO, Authentication authentication) {
        Long userId = this.userService.getIdByUsername(orderDTO.getUsername());
        Order order = new Order();
        order.setPlacedDate(orderDTO.getDatePlaced());
        order.setUserId(userId);
        order.setPhoneNumber(orderDTO.getPhoneNumber());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setShippingName(orderDTO.getShippingName());
        order.setShippingCity(orderDTO.getShippingCity());
        order.setStatus(Status.PROCESSED);
        Order createdOrder = orderService.createOrder(order);
        orderDTO.getItems().forEach(item -> {
            ShoppingCartItem cartItem = new ShoppingCartItem();
            cartItem.setOrderId(createdOrder.getId());
            Long productId = this.productService.getProductByTitle(item.getProductTitle()).getId();
            cartItem.setProductId(productId);
            cartItem.setQuantity(item.getQuantity());
            this.shoppingCartItemService.createShoppingCartItem(cartItem);
        });
        return new ResponseEntity<OrderDTO>(orderDTO,HttpStatus.OK);
    }

    @GetMapping("/orders")
    public ResponseEntity getAllOrders(Authentication authentication) {
        List<Order> orders = new ArrayList<>();
        if(hasAuthority(authentication, "ADMIN")) {
           orders = orderService.getOrders();
        } else if (hasAuthority(authentication, "DEFAULT")) {
            String username = authentication.getName();
            Long currentUserId = userService.getIdByUsername(username);
            orders = orderService.getOrdersByUserId(currentUserId);
        } else {
            throw new NotAllowedException();
        }
            List<OrderDTO> orderDTOS = new ArrayList<>();
            orders.forEach(order -> {
                OrderDTO o = new OrderDTO();
                o.setId(order.getId());
                o.setShippingName(order.getShippingName());
                o.setDatePlaced(order.getPlacedDate());
                o.setStatus(order.getStatus());
                o.setPhoneNumber(order.getPhoneNumber());
                o.setShippingCity(order.getShippingCity());
                o.setShippingAddress(order.getShippingAddress());
                o.setUserId(order.getUserId());
                o.setUsername(userService.getUser(order.getUserId()).getUsername());
                List<ShoppingCartItemDTO> itemDTOS = new ArrayList<>();
                shoppingCartItemService.getAllByOrderId(order.getId()).forEach(item -> {
                    ShoppingCartItemDTO itemDTO = new ShoppingCartItemDTO();
                    itemDTO.setProductTitle(productService.getProduct(item.getProductId()).getTitle());
                    itemDTO.setProductPrice(productService.getProduct(item.getProductId()).getPrice());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setTotalPrice(itemDTO.getQuantity() * itemDTO.getProductPrice());
                    itemDTOS.add(itemDTO);
                });
                o.setItems(itemDTOS);
                orderDTOS.add(o);
            });
            return new ResponseEntity<List<OrderDTO>>(orderDTOS, HttpStatus.OK);
    }

    @PutMapping("/update-order/{orderId}")
    public ResponseEntity markOrder(@PathVariable Long orderId, Authentication authentication) {
        if(hasAuthority(authentication, "ADMIN")) {
            Order foundOrder = orderService.getOrder(orderId);
            Status status = Status.PROCESSED;
            if (foundOrder.getStatus().equals(Status.PROCESSED)) {
                status = Status.DELIVERING;
            } else if (foundOrder.getStatus().equals(Status.DELIVERING)) {
                status = Status.DELIVERED;
            }
            Order order = orderService.editOrder(status, orderId);
            OrderDTO o = new OrderDTO();
            o.setId(order.getId());
            o.setShippingName(order.getShippingName());
            o.setDatePlaced(order.getPlacedDate());
            o.setStatus(order.getStatus());
            o.setPhoneNumber(order.getPhoneNumber());
            o.setShippingCity(order.getShippingCity());
            o.setShippingAddress(order.getShippingAddress());
            o.setUserId(order.getUserId());
            o.setUsername(userService.getUser(order.getUserId()).getUsername());
            List<ShoppingCartItemDTO> itemDTOS = new ArrayList<>();
            shoppingCartItemService.getAllByOrderId(order.getId()).forEach(item -> {
                ShoppingCartItemDTO itemDTO = new ShoppingCartItemDTO();
                itemDTO.setProductTitle(productService.getProduct(item.getProductId()).getTitle());
                itemDTO.setProductPrice(productService.getProduct(item.getProductId()).getPrice());
                itemDTO.setQuantity(item.getQuantity());
                itemDTO.setTotalPrice(itemDTO.getQuantity() * itemDTO.getProductPrice());
                itemDTOS.add(itemDTO);
            });
            o.setItems(itemDTOS);
            o.setStatus(order.getStatus());
            return new ResponseEntity<OrderDTO>(o, HttpStatus.OK);
        } else {
            throw new NotAllowedException();
        }
    }
}
