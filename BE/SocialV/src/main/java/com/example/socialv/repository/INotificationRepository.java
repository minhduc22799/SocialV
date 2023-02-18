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
    @Modifying
    @Query(value = "select * from notifications noti join post on noti.post_id = post.id where post.user_id = ?1 and (noti.noti_type_id = 2 or noti.noti_type_id = 3)", nativeQuery = true)
    List<Notifications> getAll(Long userId);

    @Query(value = "select * from notifications noti where noti.noti_type_id = 1", nativeQuery = true)
    List<Notifications> getAllNewFriendPost(Long userId);

    @Modifying
    @Query(value = "delete from notifications where post_id = ?1 and noti_type_id = ?2", nativeQuery = true)
    void deleteNotification(Long postId, Long typeId);

    @Modifying
    @Query(value = "insert into notifications(user_id, post_id, noti_type_id, notification_at, status) values(?1, ?2, ?3, time(now()), false)", nativeQuery = true)
    void createNotification(Long userId, Long postId, Long typeId);
}
