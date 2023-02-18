package com.example.socialv.service.NotificationService;

import com.example.socialv.model.Notifications;
import com.example.socialv.model.Post;
import com.example.socialv.model.Users;
import com.example.socialv.service.IGeneralService;

import java.util.List;

public interface INotificationService extends IGeneralService<Notifications> {
    void deleteAllByPost(Post post);
    List<Notifications> getAll(Long userId);
    void deleteNotification(Long postId, Long typeId);
    void createNotification(Long userId, Long postId, Long typeId);
}
