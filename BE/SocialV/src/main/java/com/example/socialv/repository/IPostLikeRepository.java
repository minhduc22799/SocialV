package com.example.socialv.repository;

import com.example.socialv.model.PostLike;
import com.example.socialv.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface IPostLikeRepository extends JpaRepository<PostLike, Long> {
    @Query(value = "select * from post_like where user_id = ?1 and post_id = ?2", nativeQuery = true)
    Optional<PostLike> findPostLike(Long userId, Long postId);
}
