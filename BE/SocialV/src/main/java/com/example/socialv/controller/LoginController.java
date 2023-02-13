package com.example.socialv.controller;

import com.example.socialv.model.UserUpdate;
import com.example.socialv.model.Users;
import com.example.socialv.service.login.LoginSevice;
import com.example.socialv.service.userService.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class LoginController {
    @Autowired
    private LoginSevice loginSevice;
    @Autowired
    private UserService userService;
    @PostMapping("/login")
    public ResponseEntity<Users> login(@RequestBody Users users) {
        if (loginSevice.login(users)) {
            users.setCheckOn(true);
            return new ResponseEntity<>(userService.findUserByUsername(users.getUsername()), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @PutMapping("/changePw")
    public ResponseEntity<String> changePassword(@RequestBody UserUpdate userUpdate) {
        if (loginSevice.changePassword(userUpdate)) {
            return new ResponseEntity<>("Change password successfully!", HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
