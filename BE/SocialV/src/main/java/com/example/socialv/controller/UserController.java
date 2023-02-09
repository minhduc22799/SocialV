package com.example.socialv.controller;

import com.example.socialv.service.userService.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class UserController {
@Autowired
    private IUserService userService;

}
