package com.huyphan.services;

import com.huyphan.models.Notification;
import com.huyphan.models.PageOptions;
import com.huyphan.models.User;
import com.huyphan.repositories.NotificationRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService implements NotificationSender {

    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private UserService userService;

    public Slice<Notification> getNotifications(PageOptions options) {
        Sort sort = Sort.by(Order.desc("created"));
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sort);
        User user = userService.getUser();

        return notificationRepository.findByUserId(user.getId(), pageable);
    }

    @Transactional
    public void markAllNotificationsAsViewed() {
        User user = userService.getUser();
        notificationRepository.markAllAsViewed(user.getId());
    }

    @Transactional
    public void deleteAllNotifications() {
        User user = userService.getUser();
        notificationRepository.deleteAllByUserId(user.getId());
    }

    public List<Notification> getLatestNotifications(Instant targetDate) {
        User user = userService.getUser();
        return notificationRepository.findByUserIdAndCreatedGreaterThan(user.getId(), targetDate);
    }

    @Override
    public void send(Notification notification, User receiver) {
        User user = userService.getUser();

        if (receiver.getId().equals(user.getId())) {
            return;
        }
        
        notification.setUser(receiver);
        notificationRepository.save(notification);
    }
}
