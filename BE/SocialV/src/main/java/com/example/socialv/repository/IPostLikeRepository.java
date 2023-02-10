package com.example.socialv.repository;

import com.example.socialv.model.PostLike;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface IPostLikeRepository {
    @Query(value = "select * from post_like where user_id = ?1 and post_id = ?2", nativeQuery = true)
    Optional<PostLike> findPostLike(Long userId, Long postId);
}
