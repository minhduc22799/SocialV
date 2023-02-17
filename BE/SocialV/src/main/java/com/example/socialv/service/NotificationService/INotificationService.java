package com.example.socialv.service.NotificationService;

import com.example.socialv.model.Notification;
import com.example.socialv.model.Post;
import com.example.socialv.model.Users;
import com.example.socialv.service.IGeneralService;

public interface INotificationService extends IGeneralService<Notification> {
    void deleteAllByPost(Post post);
    Iterable<Notification> getAllByUsers(Users users);
    void deleteNotification(Long postId, Long typeId);
    void createNotification(Long userId, Long postId, Long typeId);
}
