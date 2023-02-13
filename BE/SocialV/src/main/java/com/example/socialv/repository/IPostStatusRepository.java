package com.example.socialv.repository;

import com.example.socialv.model.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPostStatusRepository extends JpaRepository<PostStatus, Long> {
}
