package com.huyphan.models.builders;

import com.huyphan.models.Comment;
import lombok.AllArgsConstructor;
import org.springframework.web.util.UriComponentsBuilder;

@AllArgsConstructor
public abstract class CommentNotificationBuilder implements NotificationBuilder<Comment> {

    @Override
    public String buildDestUrl(Comment comment) {
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
