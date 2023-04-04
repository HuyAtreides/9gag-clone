package com.huyphan.services.notification.builders;

import com.huyphan.models.Notification;
import com.huyphan.models.User;
import com.huyphan.models.enums.NotificationType;
import com.huyphan.services.UserService;
import com.huyphan.services.notification.payload.FollowUserNotificationPayload;
import com.huyphan.services.notification.receiverresolver.NotificationReceiverResolver;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class FollowUserNotificationBuilder implements
        NotificationBuilder<FollowUserNotificationPayload> {

    @Autowired
    private NotificationReceiverResolver<FollowUserNotificationPayload> receiverResolver;

    @Override
    public List<Notification> build(FollowUserNotificationPayload notificationPayload) {
        List<User> receivers = receiverResolver.resolve(notificationPayload);
        String destUrl = buildDestUrl(notificationPayload);
        String message = "A user just followed you!";
        return receivers.stream().map(receiver -> {
            Notification notification = new Notification();
            notification.setDestUrl(destUrl);
            notification.setType(NotificationType.FOLLOW_USER);
            notification.setMessage(message);
            notification.setUser(receiver);

            return notification;
        }).collect(Collectors.toList());
    }

    @Override
    public String buildDestUrl(FollowUserNotificationPayload notificationPayload) {
        User user = UserService.getUser();
        UriComponentsBuilder destUrlBuilder = UriComponentsBuilder.fromPath("/user");
        destUrlBuilder.path("/{userId}");
        assert user != null;
        return destUrlBuilder.build(user.getId()).toString();
    }

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.FOLLOW_USER;
    }
}
