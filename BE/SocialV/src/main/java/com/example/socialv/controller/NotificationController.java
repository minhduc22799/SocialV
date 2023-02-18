package com.example.socialv.controller;

import com.example.socialv.model.Notifications;
import com.example.socialv.model.Users;
import com.example.socialv.service.NotificationService.INotificationService;
import com.example.socialv.service.userService.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/notification")
public class NotificationController {
    @Autowired
    private INotificationService notificationService;
    @Autowired
    private IUserService userService;

    @GetMapping("/seen/{id}")
    public ResponseEntity<?> seenNotification(@PathVariable Long id) {
        Notifications notification = notificationService.findById(id).get();
        notification.setStatus(true);
        notificationService.save(notification);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<Notifications>> getAll(@PathVariable Long id){
        Users users = userService.findById(id).get();
        List<Notifications> notifications = notificationService.getAllByUsers(users);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }
}
