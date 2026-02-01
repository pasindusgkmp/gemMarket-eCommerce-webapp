package com.example.demo.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.BidEntity;
import com.example.demo.Entity.ProductEntity;
import com.example.demo.Repository.BidRepository;
import com.example.demo.Repository.ProductRepository;

@Service
public class BidService {

    @Autowired
    private BidRepository bidRepo;

    @Autowired
    private ProductRepository productRepo;

    public BidEntity placeBid(Long productId, Long buyerId, double amount){

        ProductEntity product = productRepo.findById(productId).get();
        LocalDateTime now = LocalDateTime.now();

        if (!"ACTIVE".equals(product.getStatus())) {
            throw new RuntimeException("Product is not active for bidding");
        }

        if (product.getAuctionStart() != null && product.getAuctionStart().isAfter(now)) {
            throw new RuntimeException("Auction has not started yet");
        }

        if (product.getAuctionEnd() != null && product.getAuctionEnd().isBefore(now)) {
            throw new RuntimeException("Auction has already ended");
        }

        List<BidEntity> bids =
                bidRepo.findByProductIdOrderByBidAmountDesc(productId);

        double highestBid = bids.isEmpty()
                ? product.getStartingPrice()
                : bids.get(0).getBidAmount();

        if(amount <= highestBid){
            throw new RuntimeException("Bid must be higher than current highest bid: " + highestBid);
        }

        BidEntity bid = new BidEntity();
        bid.setProductId(productId);
        bid.setBuyerId(buyerId);
        bid.setBidAmount(amount);
        bid.setBidTime(LocalDateTime.now());

        return bidRepo.save(bid);
    }

    public List<BidEntity> getBidsByProductId(Long productId) {
        return bidRepo.findByProductIdOrderByBidAmountDesc(productId);
    }
}