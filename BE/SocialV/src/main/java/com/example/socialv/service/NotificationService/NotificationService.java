package com.example.socialv.service.NotificationService;

import com.example.socialv.model.Notifications;
import com.example.socialv.model.Post;
import com.example.socialv.model.Users;
import com.example.socialv.repository.INotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService implements INotificationService {

    @Autowired
    private INotificationRepository notificationRepository;

    @Override
    public Iterable<Notifications> findAll() {
        return null;
    }

    @Override
    public Optional<Notifications> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public void save(Notifications notification) {
    }

    @Override
    public void remove(Long id) {

    }

    @Override
    public void deleteAllByPost(Post post) {
        notificationRepository.deleteAllByPost(post);
    }

    @Override
    public List<Notifications> getAllByUsers(Users users) {
        return notificationRepository.getAllByUsers(users);
    }

    @Override
    public void deleteNotification(Long postId, Long typeId) {
        notificationRepository.deleteNotification(postId, typeId);
    }

    @Override
    public void createNotification(Long userId, Long postId, Long typeId) {
        notificationRepository.createNotification(userId, postId, typeId);
    }
}
