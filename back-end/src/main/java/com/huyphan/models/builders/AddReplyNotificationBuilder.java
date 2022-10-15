package com.huyphan.models.builders;

import com.huyphan.models.Comment;
import com.huyphan.models.Notification;
import com.huyphan.models.enums.NotificationType;
import org.springframework.stereotype.Component;

@Component
public class AddReplyNotificationBuilder extends CommentNotificationBuilder {

    @Override
    public Notification build(Comment comment) {
        Notification notification = new Notification();
        notification.setType(NotificationType.ADD_REPLY);
        notification.setDestUrl(buildDestUrl(comment));
        notification.setMessage("Someone replies to your comment");
        return notification;
    }
}
