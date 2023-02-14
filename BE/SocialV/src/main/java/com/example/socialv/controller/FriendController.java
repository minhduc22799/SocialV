package com.example.socialv.controller;

import com.example.socialv.model.FriendRequest;
import com.example.socialv.model.Users;
import com.example.socialv.service.FriendRequestService.IFriendRequestService;
import com.example.socialv.service.userService.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/friend")
public class FriendController {
    @Autowired
    private IFriendRequestService friendRequestService;
    @Autowired
    private IUserService userService;

    @GetMapping("/mutual/{id1}/{id2}")
    public ResponseEntity<List<Users>> mutualFriends(@PathVariable("id1") Long id1, @PathVariable("id2") Long id2){
        //id1 cua friend, id2 cua nguoi dang nhap
        List<Users> usersList = new ArrayList<>();
        for (Users u: userService.findFriendRequestsByIdAndStatusTrue(id2)){
            Optional<FriendRequest> friendRequest = friendRequestService.findFriendRequest(id1, u.getId());
            if (friendRequest.isPresent()){
                usersList.add(u);
            }
        }
        return new ResponseEntity<>(usersList, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<List<Users>> getListFriend(@PathVariable Long id){
        List<Users> usersList = userService.findFriendRequestsByIdAndStatusTrue(id);
        return new ResponseEntity<>(usersList, HttpStatus.OK);
    }



}
