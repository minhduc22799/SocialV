package com.example.socialv.repository;

import com.example.socialv.model.Notification;
import com.example.socialv.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface INotificationRepository extends JpaRepository<Notification, Long> {
    void deleteAllByPost(Post post);
}
