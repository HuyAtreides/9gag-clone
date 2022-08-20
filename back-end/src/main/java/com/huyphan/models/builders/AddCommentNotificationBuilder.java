package com.huyphan.models.builders;

import com.huyphan.models.Comment;
import com.huyphan.models.enums.NotificationType;

public class AddCommentNotificationBuilder extends CommentNotificationBuilder {

    public AddCommentNotificationBuilder(Comment comment) {
        super(comment);
    }

    @Override
    NotificationType getType() {
        return NotificationType.ADD_COMMENT;
    }
}
