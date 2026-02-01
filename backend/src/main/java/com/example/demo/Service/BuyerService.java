package com.example.demo.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.BuyerEntity;
import com.example.demo.Repository.BuyerRepository;

@Service
public class BuyerService {

    @Autowired
    private BuyerRepository repo;

    public BuyerEntity save(BuyerEntity buyer){
        return repo.save(buyer);
    }

    public List<BuyerEntity> getAll(){
        return repo.findAll();
    }

    public BuyerEntity update(Long id, BuyerEntity buyerDetails) {
        BuyerEntity buyer = repo.findById(id).orElseThrow(() -> new RuntimeException("Buyer not found"));
        buyer.setName(buyerDetails.getName());
        buyer.setUsername(buyerDetails.getUsername());
        buyer.setPassword(buyerDetails.getPassword());
        buyer.setPhone(buyerDetails.getPhone());
        return repo.save(buyer);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public BuyerEntity login(String username, String password) {
        BuyerEntity buyer = repo.findByUsername(username);
        if (buyer != null && buyer.getPassword().equals(password)) {
            return buyer;
        }
        return null;
    }
}
