package com.example.socialv.service.NotificationService;

import com.example.socialv.model.Notification;
import com.example.socialv.model.Post;
import com.example.socialv.model.Users;
import com.example.socialv.repository.INotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NotificationService implements INotificationService {

    @Autowired
    private INotificationRepository notificationRepository;

    @Override
    public Iterable<Notification> findAll() {
        return null;
    }

    @Override
    public Optional<Notification> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public Users save(Notification notification) {

        return null;
    }

    @Override
    public void remove(Long id) {

    }

    @Override
    public void deleteAllByPost(Post post) {
        notificationRepository.deleteAllByPost(post);
    }
}
