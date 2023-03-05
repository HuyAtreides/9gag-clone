package com.huyphan.services.notification.payload;

import com.huyphan.models.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public abstract class CommentNotificationPayload implements NotificationPayload {

    private Comment comment;
}
