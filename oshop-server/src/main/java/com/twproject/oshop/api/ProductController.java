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

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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

    @GetMapping("/products/categories")
    public ResponseEntity getProductsCategories() {
        List<Product> productList = productService.getProducts();
        List<String> categories = new ArrayList<>();
        productList.forEach(product -> {categories.add(product.getCategory());});
        Set<String> categoriesSet = new HashSet<>(categories);
        return new ResponseEntity<>(categoriesSet, HttpStatus.OK);
    }

    @PostMapping("/products")
    public ResponseEntity createProduct(@RequestBody Product product, Authentication authentication) {
        if (hasAuthority(authentication, "ADMIN")) {
            this.productService.createProduct(product);
            return new ResponseEntity<>(product, HttpStatus.OK);
        } else {
            throw new NotAllowedException();
        }
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity getProduct(@PathVariable("productId") Long productId) {
        return new ResponseEntity<Product>(this.productService.getProduct(productId), HttpStatus.OK);
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity editProduct(@PathVariable("productId") Long productId, @RequestBody Product newProduct, Authentication authentication) {
        if (hasAuthority(authentication, "ADMIN")) {
            Product editedProduct = productService.editProduct(productId, newProduct);
            return new ResponseEntity<>(editedProduct, HttpStatus.OK);
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
