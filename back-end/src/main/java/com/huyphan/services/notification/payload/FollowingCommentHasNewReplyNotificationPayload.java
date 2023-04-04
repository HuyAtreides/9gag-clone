package com.huyphan.services.notification.payload;

import com.huyphan.models.Comment;
import com.huyphan.models.enums.NotificationType;
import lombok.Getter;

@Getter
public class FollowingCommentHasNewReplyNotificationPayload extends CommentNotificationPayload {

    public FollowingCommentHasNewReplyNotificationPayload(Comment comment) {
        super(comment);
    }

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.FOLLOWING_COMMENT_HAS_NEW_REPLY;
    }


}