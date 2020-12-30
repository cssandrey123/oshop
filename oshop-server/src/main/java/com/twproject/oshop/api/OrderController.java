package com.twproject.oshop.api;

import com.twproject.oshop.model.Order;
import com.twproject.oshop.model.OrderDTO;
import com.twproject.oshop.model.ShoppingCartItem;
import com.twproject.oshop.service.OrderService;
import com.twproject.oshop.service.ProductService;
import com.twproject.oshop.service.ShoppingCartItemService;
import com.twproject.oshop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
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
        System.out.println(orderDTO.getDatePlaced());
        System.out.println(orderDTO.getUsername());
        orderDTO.getItems().forEach(item -> System.out.println(item.getProductTitle()));
        Long userId = this.userService.getIdByUsername(orderDTO.getUsername());
        Date placedDate = orderDTO.getDatePlaced();
        Order order = new Order();
        order.setPlacedDate(placedDate);
        order.setUserId(userId);
        order.setPhoneNumber(orderDTO.getPhoneNumber());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setShippingName(orderDTO.getShippingName());
        order.setShippingCity(orderDTO.getShippingCity());
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
}
