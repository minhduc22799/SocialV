package com.example.socialv.controller;

import com.example.socialv.dto.PostDisplay;
import com.example.socialv.dto.PostProperty;
import com.example.socialv.model.ImagePost;
import com.example.socialv.model.Post;
import com.example.socialv.model.PostLike;
import com.example.socialv.model.User;
import com.example.socialv.service.FriendRequestService.IFriendRequestService;
import com.example.socialv.service.IPostLikeService.IPostLikeService;
import com.example.socialv.service.ImagePostService.IImagePostService;
import com.example.socialv.service.postService.IPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class PostController {
    @Autowired
    private IPostService postService;
    @Autowired
    private IImagePostService imagePostService;
    @Autowired
    private IFriendRequestService friendRequestService;
    @Autowired
    private IPostLikeService postLikeService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Post post, List<ImagePost> listImg) {
        postService.save(post);
        if (!listImg.isEmpty()) {
            for (ImagePost img : listImg) {
                imagePostService.save(img);
            }
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PostProperty>> getAllPostNewFeed(User user){
        List<User> users = friendRequestService.findFriendRequestsByIdAndStatusTrue(user.getId());
        List<PostProperty> postDisplays = new ArrayList<>();
        for (User u: users){
            postDisplays.addAll(postService.findAllByUser(u.getId()));
        }
        if (postDisplays.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        for (PostProperty postProperty: postDisplays){
            postProperty.setCheckUserLiked(checkUserLiked(user, postProperty));
        }
        return new ResponseEntity<>(postDisplays, HttpStatus.OK);
    }

    private boolean checkUserLiked(User user, PostProperty post){
        Optional<PostLike> postLike = postLikeService.findPostLike(user.getId(), post.getId());
        return postLike.isPresent();
    }
}
