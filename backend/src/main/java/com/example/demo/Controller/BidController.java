package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.BidEntity;
import com.example.demo.Service.BidService;

@RestController
@RequestMapping("/bid")
@CrossOrigin
public class BidController {

    @Autowired
    private BidService service;

    @PostMapping("/place")
    public ResponseEntity<?> placeBid(@RequestParam Long productId,
                        @RequestParam Long buyerId,
                        @RequestParam double amount){
        try {
            return ResponseEntity.ok(service.placeBid(productId, buyerId, amount));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/product/{productId}")
    public List<BidEntity> getBidsByProductId(@PathVariable Long productId) {
        return service.getBidsByProductId(productId);
    }
}

