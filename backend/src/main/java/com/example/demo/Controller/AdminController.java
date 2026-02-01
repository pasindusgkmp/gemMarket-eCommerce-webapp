package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.AdminEntity;
import com.example.demo.Service.AdminService;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminService service;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminEntity admin) {
        AdminEntity loggedInAdmin = service.login(admin.getUsername(), admin.getPassword());
        if (loggedInAdmin != null) {
            return ResponseEntity.ok(loggedInAdmin);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}

