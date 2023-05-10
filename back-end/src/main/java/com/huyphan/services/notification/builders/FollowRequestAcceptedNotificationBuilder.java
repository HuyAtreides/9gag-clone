package com.huyphan.services.notification.builders;

import com.huyphan.models.Notification;
import com.huyphan.models.User;
import com.huyphan.models.enums.NotificationType;
import com.huyphan.services.UserService;
import com.huyphan.services.notification.payload.FollowRequestAcceptedNotificationPayload;
import com.huyphan.services.notification.payload.FollowUserNotificationPayload;
import com.huyphan.services.notification.receiverresolver.NotificationReceiverResolver;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class FollowRequestAcceptedNotificationBuilder implements NotificationBuilder<FollowRequestAcceptedNotificationPayload>{


    @Autowired
    private NotificationReceiverResolver<FollowRequestAcceptedNotificationPayload> receiverResolver;

    @Override
    public List<Notification> build(FollowRequestAcceptedNotificationPayload notificationPayload) {
        List<User> receivers = receiverResolver.resolve(notificationPayload);
        String destUrl = buildDestUrl(notificationPayload);
        String message = "A user just accepted your follow request!";
        return receivers.stream().map(receiver -> {
            Notification notification = new Notification();
            notification.setDestUrl(destUrl);
            notification.setType(NotificationType.FOLLOW_REQUEST_ACCEPTED);
            notification.setMessage(message);
            notification.setUser(receiver);

            return notification;
        }).collect(Collectors.toList());
    }

    @Override
    public String buildDestUrl(FollowRequestAcceptedNotificationPayload notificationPayload) {
        User user = UserService.getUser();
        UriComponentsBuilder destUrlBuilder = UriComponentsBuilder.fromPath("/user");
        destUrlBuilder.path("/{userId}");
        assert user != null;
        return destUrlBuilder.build(user.getId()).toString();
    }

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.FOLLOW_REQUEST_ACCEPTED;
    }
}
