package com.huyphan.services.notification.builders;

import com.huyphan.models.Notification;
import com.huyphan.models.User;
import com.huyphan.models.enums.NotificationType;
import com.huyphan.services.notification.payload.CommentNotificationPayload;
import com.huyphan.services.notification.receiverresolver.NotificationReceiverResolver;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
public class FollowingPostHasNewCommentNotificationBuilder extends CommentNotificationBuilder {

    @Autowired
    @Qualifier("postFollowersResolver")
    private NotificationReceiverResolver<CommentNotificationPayload> receiverResolver;


    @Override
    public List<Notification> build(CommentNotificationPayload notificationPayload) {
        List<User> receivers = receiverResolver.resolve(notificationPayload);
        String destUrl = buildDestUrl(notificationPayload);
        String message = "A post you follow receives new comment";
        User sender = notificationPayload.getSender();

        return receivers.stream().map(receiver -> {
            Notification notification = new Notification();
            notification.setType(NotificationType.FOLLOWING_POST_HAS_NEW_COMMENT);
            notification.setDestUrl(destUrl);
            notification.setMessage(message);
            notification.setUser(receiver);
            notification.setSender(sender);

            return notification;
        }).collect(Collectors.toList());

    }

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.FOLLOWING_POST_HAS_NEW_COMMENT;
    }
}
