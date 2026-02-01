package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.BuyerEntity;
import com.example.demo.Service.BuyerService;

@RestController
@RequestMapping("/buyer")
@CrossOrigin
public class BuyerController {

    @Autowired
    private BuyerService service;

    @PostMapping("/add")
    public BuyerEntity add(@RequestBody BuyerEntity buyer){
        return service.save(buyer);
    }

    @GetMapping("/all")
    public List<BuyerEntity> getAll(){
        return service.getAll();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody BuyerEntity buyer) {
        BuyerEntity loggedInBuyer = service.login(buyer.getUsername(), buyer.getPassword());
        if (loggedInBuyer != null) {
            return ResponseEntity.ok(loggedInBuyer);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/update/{id}")
    public BuyerEntity update(@PathVariable Long id, @RequestBody BuyerEntity buyer) {
        return service.update(id, buyer);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
