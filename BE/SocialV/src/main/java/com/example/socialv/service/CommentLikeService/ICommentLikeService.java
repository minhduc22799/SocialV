package com.example.socialv.service.CommentLikeService;

import com.example.socialv.model.CommentLike;
import com.example.socialv.model.PostComment;
import com.example.socialv.service.IGeneralService;

public interface ICommentLikeService extends IGeneralService<CommentLike> {
    Integer countCommentLike(Long commentId);
    void deleteAllByComment(PostComment comment);
}
