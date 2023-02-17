package com.example.socialv.repository;

import com.example.socialv.model.Post;
import com.example.socialv.model.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPostLikeRepository extends JpaRepository<PostLike, Long> {
    @Query(value = "select * from post_like where user_id = ?1 and post_id = ?2", nativeQuery = true)
    Optional<PostLike> findPostLike(Long userId, Long postId);

    @Query(value = "select count(user_id) from post_like where post_id = ?1", nativeQuery = true)
    Integer countPostLike(Long postId);

    void deleteAllByPost(Post post);

    @Modifying
    @Query(value = "insert into post_like(user_id, post_id) values(?1, ?2)", nativeQuery = true)
    void like(Long id1, Long id2);

    @Modifying
    @Query(value = "delete from post_like where user_id = ?1 and post_id = ?2", nativeQuery = true)
    void unLike(Long id1, Long id2);
}
