package com.huyphan.models.builders;

import com.huyphan.models.Comment;
import com.huyphan.models.Notification;
import com.huyphan.models.enums.NotificationType;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public abstract class CommentNotificationBuilder implements NotificationBuilder {

    final private Comment comment;

    @Override
    public Notification build() {
        Notification notification = new Notification();
        notification.setType(getType());
        notification.setUser(comment.getUser());
        notification.setDestUrl(buildDestUrl());
        return notification;
    }

    abstract NotificationType getType();

    @Override
    public String buildDestUrl() {
        Long commentId = comment.getId();
        Long parentId = comment.getParent().getId();
        Long replyToId = comment.getReplyTo().getId();

        destUrlBuilder.queryParam("postId", comment.getPost().getId())
                .queryParam("commentId", commentId);

        if (parentId != null) {
            destUrlBuilder.queryParam("parentId", parentId);
        }

        if (replyToId != null) {
            destUrlBuilder.queryParam("replyToId", replyToId);
        }

        return destUrlBuilder.toUriString();
    }
}
