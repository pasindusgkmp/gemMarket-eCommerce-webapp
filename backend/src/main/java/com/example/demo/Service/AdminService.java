package com.example.demo.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.AdminEntity;
import com.example.demo.Repository.AdminRepository;

import jakarta.annotation.PostConstruct;

@Service
public class AdminService {

    @Autowired
    private AdminRepository repo;

    // Create default admin when application starts
    @PostConstruct
    public void createDefaultAdmin() {
        if (!repo.existsByUsername("admin")) {
            AdminEntity admin = new AdminEntity();
            admin.setUsername("admin");
            admin.setPassword("admin");
            admin.setRole("ADMIN");
            repo.save(admin);
            System.out.println("✅ Default admin created - Username: admin, Password: admin");
        }
    }

    public AdminEntity login(String username, String password) {
        AdminEntity admin = repo.findByUsername(username);
        if (admin != null && admin.getPassword().equals(password)) {
            return admin;
        }
        return null;
    }

    public AdminEntity save(AdminEntity admin) {
        return repo.save(admin);
    }
}
