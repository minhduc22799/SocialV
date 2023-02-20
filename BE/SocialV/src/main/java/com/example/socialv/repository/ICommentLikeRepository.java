package com.example.socialv.repository;

import com.example.socialv.model.CommentLike;
import com.example.socialv.model.Post;
import com.example.socialv.model.PostComment;
import com.example.socialv.model.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICommentLikeRepository extends JpaRepository<CommentLike, Long> {
    @Query(value = "select count(user_id) from comment_like where comment_id = ?1", nativeQuery = true)
    Integer countCommentLike(Long commentId);
    void deleteAllByComment(PostComment comment);
    @Query(value = "select * from comment_like where user_id = ?1 and comment_id = ?2", nativeQuery = true)
    Optional<CommentLike> findCommentLike(Long userId, Long commentId);
    @Modifying
    @Query(value = "insert into comment_like(user_id, comment_id) values(?1, ?2)", nativeQuery = true)
    void like(Long id1, Long id2);

    @Modifying
    @Query(value = "delete from comment_like where user_id = ?1 and comment_id = ?2", nativeQuery = true)
    void unLike(Long id1, Long id2);

}
