package com.example.socialv.controller;

import com.example.socialv.model.User;
import com.example.socialv.service.userService.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/user")
public class UserController {
@Autowired
    private IUserService userService;

@GetMapping
    public ResponseEntity<Iterable<User>> getAllUser(){
        return new ResponseEntity<>(userService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public Optional<User> findById(@PathVariable Long id) {
        return userService.findById(id);
    }

}
