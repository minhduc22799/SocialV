package com.example.socialv.service.PostCommentService;

import com.example.socialv.model.Post;
import com.example.socialv.model.PostComment;
import com.example.socialv.service.IGeneralService;

import java.util.List;

public interface IPostCommentService extends IGeneralService<PostComment> {
    Integer countPostComment(Long postId);
    List<PostComment> findAllByPost(Post post);
    void deleteAllByPost(Post post);
    Integer countUserCommentPost(Long postId);
}
