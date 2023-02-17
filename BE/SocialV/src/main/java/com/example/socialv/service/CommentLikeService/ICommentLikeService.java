package com.example.socialv.service.CommentLikeService;

import com.example.socialv.model.CommentLike;
import com.example.socialv.model.PostComment;
import com.example.socialv.model.PostLike;
import com.example.socialv.service.IGeneralService;

import java.util.Optional;

public interface ICommentLikeService extends IGeneralService<CommentLike> {
    Integer countCommentLike(Long commentId);
    void deleteAllByComment(PostComment comment);
    Optional<CommentLike> findCommentLike(Long userId, Long commentId);
    void like(Long id1, Long id2);
    void unLike(Long id1, Long id2);
}
