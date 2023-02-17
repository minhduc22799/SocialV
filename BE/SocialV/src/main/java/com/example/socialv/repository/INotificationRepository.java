package com.example.socialv.repository;

import com.example.socialv.model.Notification;
import com.example.socialv.model.Post;
import com.example.socialv.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface INotificationRepository extends JpaRepository<Notification, Long> {
    void deleteAllByPost(Post post);

    Iterable<Notification> getAllByUsers(Users users);

    @Modifying
    @Query(value = "delete from notification where post_id = ?1 and noti_type_id = ?2", nativeQuery = true)
    void deleteNotification(Long postId, Long typeId);

    @Modifying
    @Query(value = "insert into notification(user_id, post_id, noti_type_id, status) values(?1, ?2, ?3, false)", nativeQuery = true)
    void createNotification(Long userId, Long postId, Long typeId);
}
