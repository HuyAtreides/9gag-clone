package com.huyphan.services.notification.builders;

import com.huyphan.models.Notification;
import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.models.enums.NotificationType;
import com.huyphan.services.notification.payload.SharePostNotificationPayload;
import com.huyphan.services.notification.receiverresolver.NotificationReceiverResolver;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class SharePostNotificationBuilder implements NotificationBuilder<SharePostNotificationPayload>{
    @Autowired
    private NotificationReceiverResolver<SharePostNotificationPayload> receiverResolver;


    @Override
    public List<Notification> build(SharePostNotificationPayload notificationPayload) {
        List<User> receivers = receiverResolver.resolve(notificationPayload);
        String destUrl = buildDestUrl(notificationPayload);
        String message = "A user shares your post";
        User sender = notificationPayload.getSender();

        return receivers.stream().map(receiver -> {
            Notification notification = new Notification();
            notification.setDestUrl(destUrl);
            notification.setType(NotificationType.SHARE_POST);
            notification.setMessage(message);
            notification.setUser(receiver);
            notification.setSender(sender);

            return notification;
        }).collect(Collectors.toList());

    }

    @Override
    public String buildDestUrl(SharePostNotificationPayload notificationPayload) {
        Long postId = notificationPayload.getSharedPostContainerId();
        UriComponentsBuilder destUrlBuilder = UriComponentsBuilder.fromPath("/post");
        destUrlBuilder.path("/{postId}");
        return destUrlBuilder.build(postId.toString()).toString();
    }

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.SHARE_POST;
    }
}
