package com.example.socialv.repository;

import com.example.socialv.model.ImagePost;
import com.example.socialv.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IImagePostRepository extends JpaRepository<ImagePost, Long> {
    List<ImagePost> findAllByPost(Post post);
    void deleteAllByPost(Post post);
}
