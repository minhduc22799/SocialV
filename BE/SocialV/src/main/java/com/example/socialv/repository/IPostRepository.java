package com.example.socialv.repository;

import com.example.socialv.model.Post;
import com.example.socialv.model.Users;
import javafx.geometry.Pos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPostRepository extends JpaRepository<Post, Long> {
    @Query(value = "select * from post where user_id = ?1 and (post_status_id = 1 or post_status_id = 3)", nativeQuery = true)
    List<Post> findAllFriendPost(Long id);
    List<Post> findAllByUsers(Users users);
    @Query(value = "select * from post where user_id = ?1 and post_status_id = 1", nativeQuery = true)
    List<Post> findAllFriendPublicPost(Long id);
    Iterable<Post>findPostsByUsers_IdAndContentContaining(Long id,String content);
}
