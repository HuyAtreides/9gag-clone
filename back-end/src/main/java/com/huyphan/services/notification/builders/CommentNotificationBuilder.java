package com.huyphan.services.notification.builders;

import com.huyphan.models.Comment;
import com.huyphan.services.notification.payload.CommentNotificationPayload;
import lombok.AllArgsConstructor;
import org.springframework.web.util.UriComponentsBuilder;

@AllArgsConstructor
public abstract class CommentNotificationBuilder implements
        NotificationBuilder<CommentNotificationPayload> {

    @Override
    public String buildDestUrl(CommentNotificationPayload commentNotificationPayload) {
        Comment comment = commentNotificationPayload.getComment();
        UriComponentsBuilder destUrlBuilder = UriComponentsBuilder.fromPath("/post");
        Long commentId = comment.getId();
        Comment parent = comment.getParent();
        Comment replyTo = comment.getReplyTo();
        destUrlBuilder.path("/{postId}");
        destUrlBuilder.queryParam("commentId", commentId);

        if (parent != null) {
            destUrlBuilder.queryParam("parentId", parent.getId());
        }

        if (replyTo != null) {
            destUrlBuilder.queryParam("replyToId", replyTo.getId());
        }

        return destUrlBuilder.build(comment.getPost().getId()).toString();
    }
}
