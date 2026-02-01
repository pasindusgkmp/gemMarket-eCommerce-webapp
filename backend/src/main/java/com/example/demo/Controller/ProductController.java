package com.example.demo.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.ProductEntity;
import com.example.demo.Service.ProductService;

@RestController
@RequestMapping("/product")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductService service;

    @PostMapping("/add")
    public ProductEntity add(@RequestBody ProductEntity product){
        return service.add(product);
    }

    @GetMapping("/active")
    public List<ProductEntity> getActive(){
        return service.getActive();
    }

    @GetMapping("/all")
    public List<ProductEntity> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ProductEntity getById(@PathVariable Long id){
        return service.getById(id);
    }

    @PostMapping("/update/{id}")
    public ProductEntity update(@PathVariable Long id, @RequestBody ProductEntity product){
        return service.update(id, product);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }

    @GetMapping("/winners")
    public List<ProductEntity> getWinners(){
        return service.getWinners();
    }
}
