package com.example.socialv.controller;

import com.example.socialv.dto.PostDisplay;
import com.example.socialv.model.*;
import com.example.socialv.service.CommentLikeService.ICommentLikeService;
import com.example.socialv.service.FriendRequestService.IFriendRequestService;
import com.example.socialv.service.IPostLikeService.IPostLikeService;
import com.example.socialv.service.ImagePostService.IImagePostService;
import com.example.socialv.service.PostCommentService.IPostCommentService;
import com.example.socialv.service.PostStatusService.IPostStatusService;
import com.example.socialv.service.postService.IPostService;
import com.example.socialv.service.userService.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
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
    @Autowired
    private IPostCommentService postCommentService;
    @Autowired
    private ICommentLikeService commentLikeService;
    @Autowired
    private IFriendRequestService friendRequestService;
    @Autowired
    private IPostStatusService postStatusService;

    @PostMapping
    public ResponseEntity<Post> create(@RequestBody Post post) {
        post.setCreateAt(LocalDate.now());
        postService.save(post);
        return new ResponseEntity<>(post, HttpStatus.CREATED);
    }

    @GetMapping("/status")
    public ResponseEntity<Iterable<PostStatus>> getAllPostStatus(){
        return new ResponseEntity<>(postStatusService.findAll(), HttpStatus.OK);
    }

    @PostMapping("/create/img")
    public ResponseEntity<?> createImg(@RequestBody ImagePost[] imagePostList){
        for (ImagePost imagePost: imagePostList){
            imagePostService.save(imagePost);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<PostDisplay>> getAllPostNewFeed(@PathVariable Long id) {
        List<Users> users = userService.findFriendRequestsByIdAndStatusTrue(id);
        List<PostDisplay> postDisplays = new ArrayList<>();
        List<Post> posts = new ArrayList<>();
        for (Users u : users) {
            posts.addAll(postService.findAllFriendPost(u.getId()));
        }
        posts.addAll(postService.findAllPersonalPost(userService.findById(id).get()));
        if (posts.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        for (Post post : posts) {
            transferPostDisplay(postDisplays, post);
        }
        for (PostDisplay p : postDisplays) {
            p.setCheckUserLiked(checkUserLiked(userService.findById(id).get(), p));
        }
        return new ResponseEntity<>(postDisplays, HttpStatus.OK);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<List<PostDisplay>> getAllPostProfile(@PathVariable Long id) {
        List<PostDisplay> postDisplays = new ArrayList<>();
        for (Post post : postService.findAllPersonalPost(userService.findById(id).get())) {
            transferPostDisplay(postDisplays, post);
        }
        for (PostDisplay p : postDisplays) {
            p.setCheckUserLiked(checkUserLiked(userService.findById(id).get(), p));
        }
        Collections.reverse(postDisplays);
        return new ResponseEntity<>(postDisplays, HttpStatus.OK);
    }

    @GetMapping("/wall/{id1}/{id2}")
    public ResponseEntity<List<PostDisplay>> getAllPostWallFriend(@PathVariable("id1") Long id1, @PathVariable("id2") Long id2) {
        //id1 cua friend, id2 cua nguoi dang nhap
        List<PostDisplay> postDisplays = new ArrayList<>();
        Optional<FriendRequest> friendRequest = friendRequestService.findFriendRequest(id1, id2);
        if (friendRequest.isPresent()) {
            for (Post post : postService.findAllFriendPost(id1)) {
                transferPostDisplay(postDisplays, post);
            }
        } else {
            for (Post post : postService.findAllFriendPublicPost(id1)) {
                transferPostDisplay(postDisplays, post);
            }
        }
        for (PostDisplay p : postDisplays) {
            p.setCheckUserLiked(checkUserLiked(userService.findById(id2).get(), p));
        }
        Collections.reverse(postDisplays);
        return new ResponseEntity<>(postDisplays, HttpStatus.OK);
    }


    private void transferPostDisplay(List<PostDisplay> postDisplays, Post post) {
        PostDisplay postDisplay = new PostDisplay();
        postDisplay.setId(post.getId());
        postDisplay.setContent(post.getContent());
        postDisplay.setPostStatus(post.getPostStatus());
        postDisplay.setUsers(post.getUsers());
        postDisplay.setCreateAt(post.getCreateAt());
        postDisplays.add(postDisplay);
    }

    private boolean checkUserLiked(Users users, PostDisplay post) {
        Optional<PostLike> postLike = postLikeService.findPostLike(users.getId(), post.getId());
        return postLike.isPresent();
    }

    @PostMapping("/image")
    public ResponseEntity<?> getImg(@RequestBody Post[] posts) {
        List<Object> objects = new ArrayList<>();
        for (Post p : posts) {
            List<ImagePost> imagePosts = imagePostService.findAllByPost(p);
            objects.add(imagePosts);
        }
        return new ResponseEntity<>(objects, HttpStatus.OK);
    }

    @PostMapping("/like")
    public ResponseEntity<List<Integer>> getCountLikePost(@RequestBody Post[] posts) {
        List<Integer> list = new ArrayList<>();
        for (Post p : posts) {
            list.add(postLikeService.countPostLike(p.getId()));
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("/comment")
    public ResponseEntity<List<Integer>> getCountCommentPost(@RequestBody Post[] posts) {
        List<Integer> list = new ArrayList<>();
        for (Post p : posts) {
            list.add(postCommentService.countPostComment(p.getId()));
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{id}/comment")
    public ResponseEntity<List<PostComment>> getAllPostComment(@PathVariable Long id) {
        List<PostComment> postCommentList = postCommentService.findAllByPost(postService.findById(id).get());
        if (postCommentList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(postCommentList, HttpStatus.OK);
    }

    @PostMapping("/comment/like")
    public ResponseEntity<List<Integer>> getCountLikeComment(@RequestBody PostComment[] comments) {
        List<Integer> list = new ArrayList<>();
        for (PostComment c : comments) {
            list.add(commentLikeService.countCommentLike(c.getId()));
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Post> getOne(@PathVariable Long id){
        return new ResponseEntity<>(postService.findById(id).get(), HttpStatus.OK);
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<List<ImagePost>> getImagePost(@PathVariable Long id){
        return new ResponseEntity<>(imagePostService.findAllByPost(postService.findById(id).get()), HttpStatus.OK);
    }

    @PostMapping("/list/like")
    public ResponseEntity<?> getListLikeAllPost(@RequestBody Post[] posts){
        List<Object> objects = new ArrayList<>();
        for (Post p : posts) {
            List<Users> usersList = userService.findAllLikePost(p.getId());
            objects.add(usersList);
        }
        return new ResponseEntity<>(objects, HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id){
        postService.remove(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/wall/{id}/search")
    public ResponseEntity<Iterable<Post>>searchOnWall(@PathVariable("id") Long id,@RequestParam ("search") String content){
        Iterable<Post>posts=postService.findAllPostByUserIdAndContent(id,content);
        if (!posts.iterator().hasNext()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }return new ResponseEntity<>(posts,HttpStatus.OK);
    }
}
