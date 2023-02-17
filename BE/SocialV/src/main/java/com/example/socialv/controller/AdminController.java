package com.example.socialv.controller;

import com.example.socialv.model.Users;
import com.example.socialv.service.admin.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @PostMapping
    public ResponseEntity<String>blockAndUnLock(@RequestBody Users users){
        adminService.blockAndUnLockUsers(users);
        return new ResponseEntity<>(" Success ",HttpStatus.OK);
    }
}
