package com.huyphan.services.notification.builders;

import com.huyphan.models.Notification;
import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.models.enums.NotificationType;
import com.huyphan.services.notification.payload.AddPostNotificationPayload;
import com.huyphan.services.notification.receiverresolver.NotificationReceiverResolver;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class AddPostNotificationBuilder implements NotificationBuilder<AddPostNotificationPayload> {

    @Autowired
    private NotificationReceiverResolver<AddPostNotificationPayload> receiverResolver;

    @Override
    public List<Notification> build(AddPostNotificationPayload notificationPayload) {
        List<User> receivers = receiverResolver.resolve(notificationPayload);
        String destUrl = buildDestUrl(notificationPayload);
        User sender = notificationPayload.getSender();
        String message = "A user you followed just add new post";
        return receivers.stream().map(receiver -> {
            Notification notification = new Notification();
            notification.setDestUrl(destUrl);
            notification.setType(NotificationType.ADD_POST);
            notification.setMessage(message);
            notification.setUser(receiver);
            notification.setSender(sender);

            return notification;
        }).collect(Collectors.toList());
    }

    @Override
    public String buildDestUrl(AddPostNotificationPayload notificationPayload) {
        Post post = notificationPayload.getPost();
        UriComponentsBuilder destUrlBuilder = UriComponentsBuilder.fromPath("/post");
        destUrlBuilder.path("/{postId}");
        return destUrlBuilder.build(post.getId()).toString();
    }

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.ADD_POST;
    }
}
