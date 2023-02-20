package com.example.socialv.repository;

import com.example.socialv.model.Post;
import com.example.socialv.model.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPostCommentRepository extends JpaRepository<PostComment, Long> {
    @Query(value = "select count(user_id) from post_comment where post_id = ?1", nativeQuery = true)
    Integer countPostComment(Long postId);
    List<PostComment> findAllByPost(Post post);
    void deleteAllByPost(Post post);
    @Query(value = "SELECT count(DISTINCT user_id) FROM post_comment where post_id = ?1", nativeQuery = true)
    Integer countUserCommentPost(Long postId);
}
