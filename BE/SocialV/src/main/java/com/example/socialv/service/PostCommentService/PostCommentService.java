package com.example.socialv.service.PostCommentService;

import com.example.socialv.model.Post;
import com.example.socialv.model.PostComment;
import com.example.socialv.repository.ICommentLikeRepository;
import com.example.socialv.repository.IPostCommentRepository;
import com.example.socialv.service.NotificationService.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class PostCommentService implements IPostCommentService{
    @Autowired
    private IPostCommentRepository postCommentRepository;
    @Autowired
    private ICommentLikeRepository commentLikeRepository;
    @Autowired
    private INotificationService notificationService;
    @Override
    public Iterable<PostComment> findAll() {
        return null;
    }

    @Override
    public Optional<PostComment> findById(Long id) {
        return postCommentRepository.findById(id);
    }

    @Override
    @Transactional
    public void save(PostComment postComment) {
        if ((postComment.getId() == null) && (postComment.getPost().getUsers().getId() != postComment.getUsers().getId())){
            notificationService.deleteNotification(postComment.getPost().getId(), 3L);
            notificationService.createNotification(postComment.getUsers().getId(), postComment.getPost().getId(), 3L);
        }
        postCommentRepository.save(postComment);
    }

    @Override
    @Transactional
    public void remove(Long id) {
        PostComment  comment = findById(id).get();
        commentLikeRepository.deleteAllByComment(comment);
        postCommentRepository.deleteById(id);
    }

    @Override
    public Integer countPostComment(Long postId) {
        return postCommentRepository.countPostComment(postId);
    }

    @Override
    public List<PostComment> findAllByPost(Post post) {
        return postCommentRepository.findAllByPost(post);
    }

    @Override
    public void deleteAllByPost(Post post) {
        for (PostComment postComment: findAllByPost(post)){
            commentLikeRepository.deleteAllByComment(postComment);
        }
        postCommentRepository.deleteAllByPost(post);
    }

    @Override
    public Integer countUserCommentPost(Long postId) {
        return postCommentRepository.countUserCommentPost(postId);
    }
}
