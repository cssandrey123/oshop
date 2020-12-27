package com.twproject.oshop.service;

import com.twproject.oshop.exceptions.NotFoundException;
import com.twproject.oshop.model.Product;
import com.twproject.oshop.persistence.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    private Product fetchProduct(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isEmpty()) {
            throw new NotFoundException();
        }
        return product.get();
    }
    public Product getProduct(Long id) {
        return fetchProduct(id);
    }

    public List<Product> getProducts() {
        List<Product> products = new ArrayList<Product>();
        productRepository.findAll().iterator().forEachRemaining(products::add);
        return products;
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product editProduct(Long productId, Product product) {
        Product foundProduct = this.fetchProduct(productId);
        foundProduct.setCategory(product.getCategory());
        foundProduct.setImageUrl(product.getImageUrl());
        foundProduct.setPrice(product.getPrice());
        foundProduct.setTitle(product.getTitle());
        return foundProduct;

    }
    public void deleteProduct(Long productId) {
       productRepository.deleteById(productId);
    }
}
