package com.twproject.oshop.api;

import com.twproject.oshop.exceptions.NotAllowedException;
import com.twproject.oshop.model.Product;
import com.twproject.oshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ProductController {

    private ProductService productService;

    private static List<String> getAuthorityList(Authentication authentication) {
        return authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
    }

    private static boolean hasAuthority(Authentication authentication, String authorityName) {
        return getAuthorityList(authentication).contains(authorityName);
    }

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    @GetMapping("/products")
    public ResponseEntity getProducts() {
            List<Product> productList = productService.getProducts();
            return new ResponseEntity<>(productList, HttpStatus.OK);
    }

    @PostMapping("/products")
    public ResponseEntity createProduct(Product product) {
        this.productService.createProduct(product);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity editProduct(@PathVariable("productId") Long productId, Product newProduct, Authentication authentication) {
        if (hasAuthority(authentication, "ADMIN")) {
            Product oldProduct = productService.getProduct(productId);
            oldProduct.setTitle(newProduct.getTitle());
            oldProduct.setPrice(newProduct.getPrice());
            oldProduct.setImageUrl(newProduct.getImageUrl());
            oldProduct.setCategory(newProduct.getCategory());
            return new ResponseEntity<>(oldProduct, HttpStatus.OK);
        } else {
            throw new NotAllowedException();
        }
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity deleteProduct(@PathVariable("productId") Long productId, Authentication authentication) {
        if (hasAuthority(authentication, "ADMIN")) {
            productService.deleteProduct(productId);
            return new ResponseEntity<>(productId, HttpStatus.OK);
        } else {
            throw new NotAllowedException();
        }
    }
}
