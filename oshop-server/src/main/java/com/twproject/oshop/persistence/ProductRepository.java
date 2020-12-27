package com.twproject.oshop.persistence;

import com.twproject.oshop.model.Product;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends CrudRepository<Product, Long> {
    Optional<Product> findById(Long productId);

    Optional<Product> findByTitle(String title);

    Optional<List<Product>> findByCategory(String category);
}
