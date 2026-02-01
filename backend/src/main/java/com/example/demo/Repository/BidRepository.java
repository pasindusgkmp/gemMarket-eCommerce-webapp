package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.BidEntity;

public interface BidRepository extends JpaRepository<BidEntity, Long> {
	  List<BidEntity> findByProductIdOrderByBidAmountDesc(Long productId);
}
