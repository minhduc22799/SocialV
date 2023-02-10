package com.example.socialv.repository;

import com.example.socialv.model.ImagePost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IImagePostRepository extends JpaRepository<ImagePost, Long> {
}
