package com.huyphan.models.builders;

import com.huyphan.models.Comment;
import com.huyphan.models.enums.NotificationType;

public class AddReplyNotificationBuilder extends CommentNotificationBuilder {

    public AddReplyNotificationBuilder(Comment comment) {
        super(comment);
    }

    @Override
    NotificationType getType() {
        return NotificationType.ADD_REPLY;
    }
}
