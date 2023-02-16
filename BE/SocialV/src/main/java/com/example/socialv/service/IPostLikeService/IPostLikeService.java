package com.example.socialv.service.IPostLikeService;

import com.example.socialv.model.Post;
import com.example.socialv.model.PostLike;
import com.example.socialv.service.IGeneralService;

import java.util.List;
import java.util.Optional;

public interface IPostLikeService extends IGeneralService<PostLike> {
    Optional<PostLike> findPostLike(Long userId, Long postId);
    Integer countPostLike(Long postId);
    void deleteAllByPost(Post post);
    void like(Long id1, Long id2);
    void unLike(Long id1, Long id2);
}
