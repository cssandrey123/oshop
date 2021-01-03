package com.twproject.oshop.service;

import com.twproject.oshop.exceptions.NotFoundException;
import com.twproject.oshop.model.Product;
import com.twproject.oshop.persistence.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
//       productRepository.deleteAll();
//        Product spinach = new Product();
//        spinach.setPrice(4);
//        spinach.setTitle("Spinach");
//        spinach.setCategory("Vegetables");
//        spinach.setImageUrlInHex(String.format("%040x", new BigInteger(1,"https://www.publicdomainpictures.net/pictures/170000/velka/spinach-leaves-1461774375kTU.jpg" .getBytes(StandardCharsets.UTF_8))));
//        productRepository.save(spinach);
//        Product avocado = new Product();
//        avocado.setPrice(5);
//        avocado.setTitle("Avocado");
//        avocado.setCategory("Vegetables");
//        avocado.setImageUrlInHex(String.format("%040x", new BigInteger(1,"https://poise.ro/wp-content/uploads/2018/07/4.58-culturadeavocado@poise-1.0-720x668.jpg" .getBytes(StandardCharsets.UTF_8))));
//        productRepository.save(avocado);
//        Product bread = new Product();
//        bread.setCategory("Bread");
//        bread.setTitle("Freshly Baked Bread");
//        bread.setPrice(3);
//        bread.setImageUrlInHex(String.format("%040x", new BigInteger(1,"https://static.pexels.com/photos/2434/bread-food-healthy-breakfast.jpg" .getBytes(StandardCharsets.UTF_8))));
//        productRepository.save(bread);
//        Product turmeric = new Product();
//        turmeric.setTitle("Ground Turmeric");
//        turmeric.setPrice(0.75);
//        turmeric.setCategory("Seasonings");
//        turmeric.setImageUrlInHex(String.format("%040x", new BigInteger(1,"https://www.maxpixel.net/static/photo/1x/Seasoning-Powder-Curry-Spice-Ingredient-Turmeric-2344157.jpg" .getBytes(StandardCharsets.UTF_8))));
//        productRepository.save(turmeric);
//        Product banana = new Product();
//        banana.setCategory("Fruits");
//        banana.setPrice(1.25);
//        banana.setTitle("Banana");
//        banana.setImageUrlInHex(String.format("%040x", new BigInteger(1,"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Bananas.jpg/1024px-Bananas.jpg" .getBytes(StandardCharsets.UTF_8))));
//        productRepository.save(banana);
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
        foundProduct.setImageUrlInHex(product.getImageUrlInHex());
        foundProduct.setPrice(product.getPrice());
        foundProduct.setTitle(product.getTitle());
        foundProduct.setId(productId);
        productRepository.save(foundProduct);
        return foundProduct;

    }
    public void deleteProduct(Long productId) {
       productRepository.deleteById(productId);
    }

    public Product getProductByTitle(String title) {
        Optional<Product> product = this.productRepository.findByTitle(title);
        if (product.isPresent()) {
            return product.get();
        } else {
            throw new NotFoundException();
        }
    }
}
