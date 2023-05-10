package com.huyphan.services.notification.payload;

import com.huyphan.models.Comment;
import com.huyphan.models.enums.NotificationType;
import lombok.Getter;


@Getter
public class FollowingPostHasNewCommentNotificationPayload extends CommentNotificationPayload {

    public FollowingPostHasNewCommentNotificationPayload(Comment comment) {
        super(comment);
    }

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.FOLLOWING_POST_HAS_NEW_COMMENT;
    }


}
