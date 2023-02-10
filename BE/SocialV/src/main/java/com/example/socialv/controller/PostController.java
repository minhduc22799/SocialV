package com.example.socialv.controller;

import com.example.socialv.dto.PostDisplay;
import com.example.socialv.model.ImagePost;
import com.example.socialv.model.Post;
import com.example.socialv.model.PostLike;
import com.example.socialv.model.User;
import com.example.socialv.service.IPostLikeService.IPostLikeService;
import com.example.socialv.service.ImagePostService.IImagePostService;
import com.example.socialv.service.postService.IPostService;
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
@RequestMapping("/post")
public class PostController {
    @Autowired
    private IPostService postService;
    @Autowired
    private IImagePostService imagePostService;
    @Autowired
    private IUserService userService;
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
    public ResponseEntity<List<PostDisplay>> getAllPostNewFeed(@RequestBody User user){
        List<User> users = userService.findFriendRequestsByIdAndStatusTrue(user.getId());
        List<PostDisplay> postDisplays = new ArrayList<>();
        List<Post> posts = new ArrayList<>();
        for (User u: users){
            posts.addAll(postService.findAllByUser(u.getId()));
        }
        if (posts.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        for (Post post : posts) {
            PostDisplay postDisplay = new PostDisplay();
            postDisplay.setId(post.getId());
            postDisplay.setContent(post.getContent());
            postDisplay.setPostStatus(post.getPostStatus());
            postDisplay.setUser(post.getUser());
            postDisplay.setCountComment(post.getCountComment());
            postDisplay.setCountLike(post.getCountLike());
            postDisplay.setCreateAt(post.getCreateAt());
            postDisplays.add(postDisplay);
        }
        for (PostDisplay p: postDisplays){
            p.setCheckUserLiked(checkUserLiked(user, p));
        }
        return new ResponseEntity<>(postDisplays, HttpStatus.OK);
    }

    private boolean checkUserLiked(User user, PostDisplay post){
        Optional<PostLike> postLike = postLikeService.findPostLike(user.getId(), post.getId());
        return postLike.isPresent();
    }
}
