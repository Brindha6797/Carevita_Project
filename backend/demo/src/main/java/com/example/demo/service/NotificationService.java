package com.example.demo.service;

import com.example.demo.model.Notification;
import com.example.demo.model.User;
import com.example.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository repository;

    public Notification createNotification(User user, String message, String type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type);
        return repository.save(notification);
    }

    public List<Notification> getUserNotifications(User user) {
        return repository.findByUserOrderByCreatedAtDesc(user);
    }

    public void markAsRead(Long id) {
        repository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            repository.save(n);
        });
    }

    public long getUnreadCount(User user) {
        return repository.countByUserAndIsReadFalse(user);
    }
}
