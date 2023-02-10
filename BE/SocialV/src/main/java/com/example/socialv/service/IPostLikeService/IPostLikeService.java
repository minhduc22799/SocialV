package com.example.socialv.service.IPostLikeService;

import com.example.socialv.model.PostLike;
import com.example.socialv.service.IGeneralService;

import java.util.Optional;

public interface IPostLikeService extends IGeneralService<PostLike> {
    Optional<PostLike> findPostLike(Long userId, Long postId);
}
