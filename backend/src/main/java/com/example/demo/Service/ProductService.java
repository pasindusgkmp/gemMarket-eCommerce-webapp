package com.example.demo.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.BidEntity;
import com.example.demo.Entity.ProductEntity;
import com.example.demo.Repository.BidRepository;
import com.example.demo.Repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repo;

    @Autowired
    private BidRepository bidRepo;

    public ProductEntity add(ProductEntity product){
        product.setStatus("ACTIVE");
        return repo.save(product);
    }

    public List<ProductEntity> getActive(){
        return repo.findByStatus("ACTIVE");
    }

    public List<ProductEntity> getAll(){
        return repo.findAll();
    }

    public ProductEntity getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public ProductEntity update(Long id, ProductEntity details) {
        ProductEntity product = repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        product.setName(details.getName());
        product.setDescription(details.getDescription());
        product.setImage(details.getImage());
        product.setStartingPrice(details.getStartingPrice());
        product.setAuctionStart(details.getAuctionStart());
        product.setAuctionEnd(details.getAuctionEnd());
        product.setStatus(details.getStatus());
        return repo.save(product);
    }

    @jakarta.transaction.Transactional
    public void delete(Long id) {
        List<BidEntity> bids = bidRepo.findByProductIdOrderByBidAmountDesc(id);
        if (!bids.isEmpty()) {
            bidRepo.deleteAll(bids);
        }
        repo.deleteById(id);
    }

    @Scheduled(fixedRate = 60000) // Every minute
    public void checkAuctions() {
        List<ProductEntity> activeProducts = repo.findByStatus("ACTIVE");
        LocalDateTime now = LocalDateTime.now();
        for (ProductEntity product : activeProducts) {
            if (product.getAuctionEnd() != null && product.getAuctionEnd().isBefore(now)) {
                completeAuction(product);
            }
        }
    }

    private void completeAuction(ProductEntity product) {
        List<BidEntity> bids = bidRepo.findByProductIdOrderByBidAmountDesc(product.getId());
        if (!bids.isEmpty()) {
            product.setWinnerBuyerId(bids.get(0).getBuyerId());
            product.setStatus("COMPLETED");
        } else {
            product.setStatus("EXPIRED");
        }
        repo.save(product);
    }

    public List<ProductEntity> getWinners() {
        return repo.findByStatus("COMPLETED");
    }
}
