package com.huyphan.models.builders;

import com.huyphan.models.Notification;
import com.huyphan.models.Post;
import com.huyphan.models.enums.NotificationType;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@AllArgsConstructor
@Component
public class VotePostNotificationBuilder implements NotificationBuilder<Post> {

    @Override
    public Notification build(Post post) {
        Notification notification = new Notification();
        notification.setDestUrl(buildDestUrl(post));
        notification.setType(NotificationType.VOTE_POST);
        return notification;
    }

    @Override
    public String buildDestUrl(Post post) {
        UriComponentsBuilder destUrlBuilder = UriComponentsBuilder.fromPath("/post");
        destUrlBuilder.path("/{postId}");
        return destUrlBuilder.build(post.getId()).toString();
    }
}
