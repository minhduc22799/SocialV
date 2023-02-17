package com.example.socialv.service.CommentLikeService;

import com.example.socialv.model.CommentLike;
import com.example.socialv.model.PostComment;
import com.example.socialv.model.PostLike;
import com.example.socialv.model.Users;
import com.example.socialv.repository.ICommentLikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
public class CommentLikeService implements ICommentLikeService {
    @Autowired
    private ICommentLikeRepository commentLikeRepository;

    @Override
    public Iterable<CommentLike> findAll() {
        return null;
    }

    @Override
    public Optional<CommentLike> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public void save(CommentLike commentLike) {
        commentLikeRepository.save(commentLike);
    }

    @Override
    public void remove(Long id) {
        commentLikeRepository.deleteById(id);
    }

    @Override
    public Integer countCommentLike(Long commentId) {
        return commentLikeRepository.countCommentLike(commentId);
    }

    @Override
    public void deleteAllByComment(PostComment comment) {
        commentLikeRepository.deleteAllByComment(comment);
    }

    @Override
    public Optional<CommentLike> findCommentLike(Long userId, Long commentId) {
        return commentLikeRepository.findCommentLike(userId, commentId);
    }

    @Override
    @Transactional
    public void like(Long id1, Long id2) {
        commentLikeRepository.like(id1, id2);
    }

    @Override
    @Transactional
    public void unLike(Long id1, Long id2) {
        commentLikeRepository.unLike(id1, id2);
    }
}
