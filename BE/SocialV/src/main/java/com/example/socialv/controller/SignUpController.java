package com.example.socialv.controller;

import com.example.socialv.model.User;
import com.example.socialv.service.signUpService.SignUpService;
import com.example.socialv.service.userService.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class SignUpController {
    @Autowired
    private SignUpService signUpService;

    @PostMapping("/signUp")
    public ResponseEntity<String> signUp(@RequestBody User user) {
        if (signUpService.signUp(user)) {
            return new ResponseEntity<>("Sign up successfully!", HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


}
