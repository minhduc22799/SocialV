package com.example.socialv.repository;

import com.example.socialv.model.CommentLike;
import com.example.socialv.model.Post;
import com.example.socialv.model.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ICommentLikeRepository extends JpaRepository<CommentLike, Long> {
    @Query(value = "select count(user_id) from comment_like where comment_id = ?1", nativeQuery = true)
    Integer countCommentLike(Long commentId);
    void deleteAllByComment(PostComment comment);
}
