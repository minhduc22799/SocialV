package com.example.socialv.controller;

import com.example.socialv.model.Notifications;
import com.example.socialv.repository.IPostCommentRepository;
import com.example.socialv.repository.IPostLikeRepository;
import com.example.socialv.service.NotificationService.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/notification")
public class NotificationController {
    @Autowired
    private INotificationService notificationService;
    @Autowired
    private IPostLikeRepository postLikeRepository;
    @Autowired
    private IPostCommentRepository postCommentRepository;

    @GetMapping("/seen/{id}")
    public ResponseEntity<?> seenNotification(@PathVariable Long id) {
        Notifications notification = notificationService.findById(id).get();
        notification.setStatus(true);
        notificationService.save(notification);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public String greeting(String id){
        return "hello";
    }


    @GetMapping("/{id}")
    public ResponseEntity<List<Notifications>> getAll(@PathVariable Long id) {
        List<Notifications> notifications = notificationService.getAll(id);
        Collections.sort(notifications, Comparator.comparing(Notifications::getNotificationAt).reversed());
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    @PostMapping("/other")
    public ResponseEntity<List<Integer>> other(@RequestBody Notifications[] notifications){
        List<Integer> list = new ArrayList<>();
        for (Notifications n: notifications){
            if (n.getNotificationType().getId() == 2) {
                list.add(postLikeRepository.countPostLike(n.getPost().getId()));
            }else {
            if (n.getNotificationType().getId() == 3){
                list.add(postCommentRepository.countUserCommentPost(n.getPost().getId()));
            }else {
                list.add(1);
            }
            }
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}
