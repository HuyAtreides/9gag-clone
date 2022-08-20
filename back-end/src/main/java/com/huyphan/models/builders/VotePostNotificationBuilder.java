package com.huyphan.models.builders;

import com.huyphan.models.Notification;
import com.huyphan.models.Post;
import com.huyphan.models.enums.NotificationType;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class VotePostNotificationBuilder implements NotificationBuilder {

    final private Post post;

    @Override
    public Notification build() {
        Notification notification = new Notification();
        notification.setDestUrl(buildDestUrl());
        notification.setType(NotificationType.VOTE_POST);
        notification.setUser(post.getUser());
        return notification;
    }

    @Override
    public String buildDestUrl() {
        destUrlBuilder.queryParam("postId", post.getId());

        return destUrlBuilder.toUriString();
    }
}
