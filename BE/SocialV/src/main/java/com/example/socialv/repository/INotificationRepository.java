package com.example.socialv.repository;

import com.example.socialv.model.Notifications;
import com.example.socialv.model.Post;
import com.example.socialv.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface INotificationRepository extends JpaRepository<Notifications, Long> {
    void deleteAllByPost(Post post);

    List<Notifications> getAllByUsers(Users users);

    @Modifying
    @Query(value = "delete from notifications where post_id = ?1 and noti_type_id = ?2", nativeQuery = true)
    void deleteNotification(Long postId, Long typeId);

    @Modifying
    @Query(value = "insert into notifications(user_id, post_id, noti_type_id, notification_at, status) values(?1, ?2, ?3, time(now()), false)", nativeQuery = true)
    void createNotification(Long userId, Long postId, Long typeId);
}
