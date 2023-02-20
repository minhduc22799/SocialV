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
import java.time.LocalDateTime;
import java.util.*;

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
        post.setCreateAt(LocalDateTime.now());
        postService.save(post);
        return new ResponseEntity<>(post, HttpStatus.CREATED);
    }

    @GetMapping("/status")
    public ResponseEntity<Iterable<PostStatus>> getAllPostStatus() {
        return new ResponseEntity<>(postStatusService.findAll(), HttpStatus.OK);
    }

    @PostMapping("/create/img")
    public ResponseEntity<?> createImg(@RequestBody ImagePost[] imagePostList) {
        for (ImagePost imagePost : imagePostList) {
            imagePostService.save(imagePost);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<?> updatePost(@RequestBody Post post) {
        Optional<Post> postOptional = postService.findById(post.getId());
        if (!postOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        postService.save(post);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/image")
    public ResponseEntity<?> updateImgPost(@RequestBody List<Long> deleteList){
        for (Long i: deleteList){
            imagePostService.remove(i);
        }
        return new ResponseEntity<>(HttpStatus.OK);
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
            p.setCheckUserLiked(checkUserLiked(id, p.getId()));
        }
        Collections.sort(postDisplays, Comparator.comparing(PostDisplay::getCreateAt).reversed());
        return new ResponseEntity<>(postDisplays, HttpStatus.OK);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<List<PostDisplay>> getAllPostProfile(@PathVariable Long id) {
        List<PostDisplay> postDisplays = new ArrayList<>();
        for (Post post : postService.findAllPersonalPost(userService.findById(id).get())) {
            transferPostDisplay(postDisplays, post);
        }
        for (PostDisplay p : postDisplays) {
            p.setCheckUserLiked(checkUserLiked(id, p.getId()));
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
            p.setCheckUserLiked(checkUserLiked(id2, p.getId()));
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

    @GetMapping("/display/get/{id1}/{id2}")
    public ResponseEntity<PostDisplay> getPostDisplay(@PathVariable("id1") Long id1,@PathVariable("id2") Long id2){
        Post post = postService.findById(id1).get();
        PostDisplay postDisplay = new PostDisplay();
        postDisplay.setId(post.getId());
        postDisplay.setContent(post.getContent());
        postDisplay.setPostStatus(post.getPostStatus());
        postDisplay.setUsers(post.getUsers());
        postDisplay.setCreateAt(post.getCreateAt());
        postDisplay.setCheckUserLiked(checkUserLiked(id2, postDisplay.getId()));
        return new ResponseEntity<>(postDisplay, HttpStatus.OK);
    }

    private boolean checkUserLiked(Long userId, Long postId) {
        Optional<PostLike> postLike = postLikeService.findPostLike(userId, postId);
        return postLike.isPresent();
    }

    private boolean checkUserLikedComment(Long userId, Long commentId) {
        Optional<CommentLike> commentLike = commentLikeService.findCommentLike(userId, commentId);
        return commentLike.isPresent();
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

    @PostMapping("/get/like")
    public ResponseEntity<Integer> getCountLikeOnePost(@RequestBody Post post) {
        return new ResponseEntity<>(postLikeService.countPostLike(post.getId()), HttpStatus.OK);
    }

    @PostMapping("/comment")
    public ResponseEntity<List<Integer>> getCountCommentPost(@RequestBody Post[] posts) {
        List<Integer> list = new ArrayList<>();
        for (Post p : posts) {
            list.add(postCommentService.countPostComment(p.getId()));
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("/get/comment")
    public ResponseEntity<Integer> getCountCommentOnePost(@RequestBody Post post) {
        return new ResponseEntity<>(postCommentService.countPostComment(post.getId()), HttpStatus.OK);
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
    public ResponseEntity<Post> getOne(@PathVariable Long id) {
        return new ResponseEntity<>(postService.findById(id).get(), HttpStatus.OK);
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<List<ImagePost>> getImagePost(@PathVariable Long id) {
        return new ResponseEntity<>(imagePostService.findAllByPost(postService.findById(id).get()), HttpStatus.OK);
    }

    @PostMapping("/list/like")
    public ResponseEntity<?> getListLikeAllPost(@RequestBody Post[] posts) {
        List<Object> objects = new ArrayList<>();
        for (Post p : posts) {
            List<Users> usersList = userService.findAllLikePost(p.getId());
            objects.add(usersList);
        }
        return new ResponseEntity<>(objects, HttpStatus.OK);
    }

    @PostMapping("/list/get/like")
    public ResponseEntity<?> getListLikeAllPost(@RequestBody Post post) {
            List<Users> usersList = userService.findAllLikePost(post.getId());
        return new ResponseEntity<>(usersList, HttpStatus.OK);
    }

    @PostMapping("/list/comment")
    public ResponseEntity<?> getListCommentAllPost(@RequestBody Post[] posts){
        List<Object> objects = new ArrayList<>();
        for (Post p : posts) {
            List<PostComment> postCommentList = postCommentService.findAllByPost(p);
            objects.add(postCommentList);
        }
        return new ResponseEntity<>(objects, HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
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

    @GetMapping("/interact/like/{id1}/{id2}")
    public ResponseEntity<?> likeOrUnlike(@PathVariable("id1") Long userId, @PathVariable("id2") Long postId){
        if (checkUserLiked(userId, postId)){
            postLikeService.unLike(userId, postId);
        }else {
            postLikeService.like(userId, postId);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/interact/comment")
    public ResponseEntity<?> comment(@RequestBody PostComment postComment){
        postComment.setCmtAt(LocalDateTime.now());
        postCommentService.save(postComment);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/interact/comment/{id}")
    public ResponseEntity<PostComment> getComment(@PathVariable Long id){
        Optional<PostComment> postComment = postCommentService.findById(id);
        return postComment.map(comment -> new ResponseEntity<>(comment, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/interact/comment/like/{id1}/{id2}")
    public ResponseEntity<?> likeOrUnlikeComment(@PathVariable("id1") Long userId, @PathVariable("id2") Long cmtId){
        if (checkUserLikedComment(userId, cmtId)){
            commentLikeService.unLike(userId, cmtId);
        }else {
            commentLikeService.like(userId, cmtId);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("comment/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id){
        Optional<PostComment> postComment = postCommentService.findById(id);
        if (postComment.isPresent()){
            postCommentService.remove(id);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("comment/{id}")
    public ResponseEntity<?> editComment(@PathVariable Long id, @RequestBody PostComment postComment){
        Optional<PostComment> postCommentOptional = postCommentService.findById(id);
        if (postCommentOptional.isPresent()){
            postCommentService.save(postComment);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

        @PostMapping("comment/countlike")
    public ResponseEntity<?> countLikeListComment(@RequestBody List<List<PostComment>> postComments){
        List<Object> list = new ArrayList<>();
        for (int i = 0; i < postComments.size(); i++){
            List<Integer> integerList = new ArrayList<>();
            for (int j = 0; j < postComments.get(i).size(); j++){
                integerList.add(commentLikeService.countCommentLike(postComments.get(i).get(j).getId()));
            }
            list.add(integerList);
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("comment/countlike/get")
    public ResponseEntity<?> countLikeListCommentOnePost(@RequestBody List<PostComment> postComments){
            List<Integer> integerList = new ArrayList<>();
            for (int j = 0; j < postComments.size(); j++){
                integerList.add(commentLikeService.countCommentLike(postComments.get(j).getId()));
            }
        return new ResponseEntity<>(integerList, HttpStatus.OK);
    }

    @PostMapping("comment/check/like/{id}")
    public ResponseEntity<?> checkLikeListComment(@RequestBody List<List<PostComment>> postComments, @PathVariable Long id){
        List<Object> list = new ArrayList<>();
        for (int i = 0; i < postComments.size(); i++){
            List<Boolean> booleanList = new ArrayList<>();
            for (int j = 0; j < postComments.get(i).size(); j++){
                booleanList.add(checkUserLikedComment(id, postComments.get(i).get(j).getId()));
            }
            list.add(booleanList);
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("comment/check/like/get/{id}")
    public ResponseEntity<?> checkLikeComment(@RequestBody List<PostComment> postComments, @PathVariable Long id){
        List<Boolean> booleanList = new ArrayList<>();
        for (int j = 0; j < postComments.size(); j++){
            booleanList.add(checkUserLikedComment(id, postComments.get(j).getId()));
        }
        return new ResponseEntity<>(booleanList, HttpStatus.OK);
    }
}
