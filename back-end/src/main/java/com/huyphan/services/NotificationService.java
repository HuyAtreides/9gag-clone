package com.huyphan.services;

import com.huyphan.models.Notification;
import com.huyphan.models.PageOptions;
import com.huyphan.models.User;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.repositories.NotificationRepository;
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
        Sort sort = Sort.by(Order.desc("id"));
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
    public void markNotificationAsViewed(Long id) throws AppException {
        User user = userService.getUser();
        Notification notification = notificationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() ->
                        new AppException("No Notification Found")
                );
        notification.setIsViewed(true);
    }

    public int countNotViewedNotification() {
        User user = userService.getUser();

        return notificationRepository.countByIsViewedFalseAndUserId(user.getId());
    }

    @Transactional
    public void deleteAllNotifications() {
        User user = userService.getUser();
        notificationRepository.deleteAllByUserId(user.getId());
    }

    public List<Notification> getLatestNotifications(Long currentLatestId) {
        User user = userService.getUser();
        return notificationRepository.findByUserIdAndIdGreaterThanOrderByIdDesc(user.getId(),
                currentLatestId);
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
