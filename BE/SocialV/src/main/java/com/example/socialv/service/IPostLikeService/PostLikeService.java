package com.example.socialv.service.IPostLikeService;

import com.example.socialv.model.Post;
import com.example.socialv.model.PostLike;
import com.example.socialv.repository.IPostLikeRepository;
import com.example.socialv.repository.IPostRepository;
import com.example.socialv.service.NotificationService.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
public class PostLikeService implements IPostLikeService {

    @Autowired
    private IPostLikeRepository postLikeRepository;
    @Autowired
    private INotificationService notificationService;
    @Autowired
    private IPostRepository postRepository;

    @Override
    public Iterable<PostLike> findAll() {
        return null;
    }

    @Override
    public Optional<PostLike> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public void save(PostLike postLike) {
        postLikeRepository.save(postLike);
    }

    @Override
    public void remove(Long id) {

    }

    @Override
    public Optional<PostLike> findPostLike(Long userId, Long postId) {
        return postLikeRepository.findPostLike(userId, postId);
    }

    @Override
    public Integer countPostLike(Long postId) {
        return postLikeRepository.countPostLike(postId);
    }

    @Override
    public void deleteAllByPost(Post post) {
        postLikeRepository.deleteAllByPost(post);
    }

    @Override
    @Transactional
    public void like(Long id1, Long id2) {
        Post post = postRepository.findById(id2).get();
        if (id1 != post.getUsers().getId()) {
            notificationService.deleteNotification(id2, 2L);
            notificationService.createNotification(id1, id2, 2L);
        }
        postLikeRepository.like(id1, id2);
    }

    @Override
    @Transactional
    public void unLike(Long id1, Long id2) {
        postLikeRepository.unLike(id1, id2);
    }
}
