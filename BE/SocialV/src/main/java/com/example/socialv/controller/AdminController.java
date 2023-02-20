package com.example.socialv.controller;

import com.example.socialv.model.Users;
import com.example.socialv.service.admin.AdminService;
import com.example.socialv.service.userService.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;
    @Autowired
    IUserService userService;
    @PostMapping("/login")
    public ResponseEntity<Users> login(@RequestBody Users users) {
        if (adminService.loginAdmin(users)) {
            return new ResponseEntity<>(userService.findUserByUsername(users.getUsername()), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<String>blockAndUnLock(@RequestBody Users users){
        adminService.blockAndUnLockUsers(users);
        return new ResponseEntity<>(" Success ",HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<List<Users>>showAllUsers(){
        List<Users>usersList=adminService.findAllUser();
        return new ResponseEntity<>(usersList,HttpStatus.OK);
    }
}
