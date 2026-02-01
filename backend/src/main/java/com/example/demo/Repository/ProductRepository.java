package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.ProductEntity;

public interface ProductRepository extends JpaRepository<ProductEntity, Long>{
	List<ProductEntity> findByStatus(String status);
}
