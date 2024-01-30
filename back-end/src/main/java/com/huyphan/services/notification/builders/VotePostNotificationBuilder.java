package com.huyphan.services.notification.builders;

import com.huyphan.models.Notification;
import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.models.enums.NotificationType;
import com.huyphan.services.notification.payload.VotePostNotificationPayload;
import com.huyphan.services.notification.receiverresolver.NotificationReceiverResolver;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@AllArgsConstructor
@Component
public class VotePostNotificationBuilder implements
        NotificationBuilder<VotePostNotificationPayload> {

    @Autowired
    private NotificationReceiverResolver<VotePostNotificationPayload> receiverResolver;

    @Override
    public List<Notification> build(VotePostNotificationPayload votePostNotificationPayload) {
        List<User> receivers = receiverResolver.resolve(votePostNotificationPayload);
        String destUrl = buildDestUrl(votePostNotificationPayload);
        String message = "Someone votes your post";
        User sender = votePostNotificationPayload.getSender();

        return receivers.stream().map(receiver -> {
            Notification notification = new Notification();
            notification.setDestUrl(destUrl);
            notification.setType(NotificationType.VOTE_POST);
            notification.setMessage(message);
            notification.setUser(receiver);
            notification.setSender(sender);

            return notification;
        }).collect(Collectors.toList());
    }

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.VOTE_POST;
    }

    @Override
    public String buildDestUrl(VotePostNotificationPayload votePostNotificationPayload) {
        Post post = votePostNotificationPayload.getPost();
        UriComponentsBuilder destUrlBuilder = UriComponentsBuilder.fromPath("/post");
        destUrlBuilder.path("/{postId}");
        return destUrlBuilder.build(post.getId()).toString();
    }
}
