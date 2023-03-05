package com.huyphan.services.notification.payload;

import com.huyphan.models.Comment;
import com.huyphan.models.enums.NotificationType;
import lombok.Getter;


@Getter
public class AddReplyNotificationPayload extends CommentNotificationPayload {

    public AddReplyNotificationPayload(Comment comment) {
        super(comment);
    }

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.ADD_REPLY;
    }
}
