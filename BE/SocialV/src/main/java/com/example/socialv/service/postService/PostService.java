package com.example.socialv.service.postService;

import com.example.socialv.model.Post;
import com.example.socialv.model.Users;
import com.example.socialv.repository.IPostRepository;
import com.example.socialv.service.IPostLikeService.IPostLikeService;
import com.example.socialv.service.ImagePostService.IImagePostService;
import com.example.socialv.service.NotificationService.INotificationService;
import com.example.socialv.service.PostCommentService.IPostCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PostService implements IPostService{
    @Autowired
    private IPostRepository postRepository;
    @Autowired
    private IPostLikeService postLikeService;
    @Autowired
    private IPostCommentService postCommentService;
    @Autowired
    private INotificationService notificationService;
    @Autowired
    private IImagePostService imagePostService;

    @Override
    public Iterable<Post> findAll() {
        return postRepository.findAll();
    }

    @Override
    public Optional<Post> findById(Long id) {
        return postRepository.findById(id);
    }

    @Override
    @Transactional
    public void save(Post post) {
        if (post.getId() == null){
            postRepository.save(post);
            if (post.getPostStatus().getId() != 2) {
                notificationService.createNotification(post.getUsers().getId(), post.getId(), 1L);
            }
        }
        postRepository.save(post);
    }


    @Override
    @Transactional
    public void remove(Long id) {
        postLikeService.deleteAllByPost(findById(id).get());
        postCommentService.deleteAllByPost(findById(id).get());
        notificationService.deleteAllByPost(findById(id).get());
        imagePostService.deleteAllByPost(findById(id).get());
        postRepository.deleteById(id);
    }

    @Override
    public List<Post> findAllFriendPost(Long id) {
        return postRepository.findAllFriendPost(id);
    }

    @Override
    public List<Post> findAllPersonalPost(Users users) {
        return postRepository.findAllByUsers(users);
    }

    @Override
    public List<Post> findAllFriendPublicPost(Long id) {
        return postRepository.findAllFriendPublicPost(id);
    }


    @Override
    public Iterable<Post> findAllPostByUserIdAndContent(Long id, String content) {
        return postRepository.findPostsByUsers_IdAndContentContaining(id, content);
    }


}
