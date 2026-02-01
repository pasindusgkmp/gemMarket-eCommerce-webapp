package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.BuyerEntity;

public interface BuyerRepository extends JpaRepository<BuyerEntity, Long>{
	BuyerEntity findByUsername(String username);
}
