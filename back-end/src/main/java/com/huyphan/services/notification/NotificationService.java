package com.huyphan.services.notification;

import com.huyphan.controllers.eventemitter.EventEmitter;
import com.huyphan.models.Notification;
import com.huyphan.models.PageOptions;
import com.huyphan.models.User;
import com.huyphan.models.enums.WebSocketEvent;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.repositories.NotificationRepository;
import com.huyphan.services.UserService;
import com.huyphan.services.notification.builders.NotificationBuilder;
import com.huyphan.services.notification.payload.NotificationPayload;
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
    @Autowired
    private List<NotificationBuilder> notificationBuilders;

    @Autowired
    private EventEmitter eventEmitter;

    public Slice<Notification> getNotifications(PageOptions options) {
        Sort sort = Sort.by(Order.desc("id"));
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sort);
        User user = UserService.getUser();
        return notificationRepository.findByUserId(user.getId(), pageable);
    }

    @Transactional
    public void markAllNotificationsAsViewed() {
        User user = UserService.getUser();
        notificationRepository.markAllAsViewed(user.getId());
    }

    @Transactional
    public void markNotificationAsViewed(Long id) throws AppException {
        User user = UserService.getUser();
        Notification notification = notificationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() ->
                        new AppException("No Notification Found")
                );
        notification.setIsViewed(true);
    }

    public int countNotViewedNotification() {
        User user = UserService.getUser();

        return notificationRepository.countByIsViewedFalseAndUserId(user.getId());
    }

    @Transactional
    public void deleteAllNotifications() {
        User user = UserService.getUser();
        notificationRepository.deleteAllByUserId(user.getId());
    }

    public List<Notification> getLatestNotifications(Long currentLatestId) {
        User user = UserService.getUser();
        return notificationRepository.getLatestNotifications(
                user,
                currentLatestId
        );
    }

    @Override
    @Transactional
    public void send(NotificationPayload notificationPayload) throws AppException {
        NotificationBuilder<NotificationPayload> notificationBuilder = notificationBuilders.stream()
                .filter(
                        builder -> notificationPayload.getNotificationType()
                                == builder.getNotificationType()
                ).findFirst().orElseThrow(() -> new AppException("Invalid notification type"));
        notificationBuilder.build(notificationPayload).forEach(notification -> {
            notificationRepository.save(notification);
            eventEmitter.emitEventTo(WebSocketEvent.RECEIVE_NEW_NOTIFICATION,
                    notification.getUser());
        });
    }
}
