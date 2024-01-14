package com.huyphan.services.notification.builders;

import com.huyphan.models.Notification;
import com.huyphan.models.User;
import com.huyphan.models.enums.NotificationType;
import com.huyphan.services.UserService;
import com.huyphan.services.notification.payload.FollowRequestAcceptedNotificationPayload;
import com.huyphan.services.notification.payload.SendFollowRequestNotificationPayload;
import com.huyphan.services.notification.receiverresolver.NotificationReceiverResolver;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class SendFollowRequestNotificationBuilder implements
        NotificationBuilder<SendFollowRequestNotificationPayload> {

    @Autowired
    private NotificationReceiverResolver<SendFollowRequestNotificationPayload> receiverResolver;

    @Override
    public List<Notification> build(SendFollowRequestNotificationPayload notificationPayload) {
        List<User> receivers = receiverResolver.resolve(notificationPayload);
        String destUrl = buildDestUrl(notificationPayload);
        String message = "A user sent you a follow request";
        User sender = notificationPayload.getSender();

        return receivers.stream().map(receiver -> {
            Notification notification = new Notification();
            notification.setDestUrl(destUrl);
            notification.setType(NotificationType.SEND_FOLLOW_REQUEST);
            notification.setMessage(message);
            notification.setUser(receiver);
            notification.setSender(sender);

            return notification;
        }).collect(Collectors.toList());
    }

    @Override
    public String buildDestUrl(SendFollowRequestNotificationPayload notificationPayload) {
        UriComponentsBuilder destUrlBuilder = UriComponentsBuilder.fromPath("/user/settings/received-follow-requests");
        destUrlBuilder.queryParam("requestId", notificationPayload.getRequestId());

        return destUrlBuilder.build().toString();
    }

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.SEND_FOLLOW_REQUEST;
    }
}
