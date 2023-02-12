package com.example.socialv.service.CommentLikeService;

import com.example.socialv.model.CommentLike;
import com.example.socialv.model.PostComment;
import com.example.socialv.repository.ICommentLikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    }

    @Override
    public void remove(Long id) {

    }

    @Override
    public Integer countCommentLike(Long commentId) {
        return commentLikeRepository.countCommentLike(commentId);
    }

    @Override
    public void deleteAllByComment(PostComment comment) {
        commentLikeRepository.deleteAllByComment(comment);
    }
}
