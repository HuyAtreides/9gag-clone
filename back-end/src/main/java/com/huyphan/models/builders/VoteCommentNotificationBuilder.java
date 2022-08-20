package com.huyphan.models.builders;

import com.huyphan.models.Comment;
import com.huyphan.models.enums.NotificationType;

public class VoteCommentNotificationBuilder extends CommentNotificationBuilder {

    public VoteCommentNotificationBuilder(Comment comment) {
        super(comment);
    }

    @Override
    NotificationType getType() {
        return NotificationType.VOTE_COMMENT;
    }
}
