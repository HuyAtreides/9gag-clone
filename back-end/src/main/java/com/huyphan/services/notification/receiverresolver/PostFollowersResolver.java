package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.Comment;
import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.repositories.NotificationRepository;
import com.huyphan.services.notification.payload.CommentNotificationPayload;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
@Qualifier("postFollowersResolver")
public class PostFollowersResolver implements
        NotificationReceiverResolver<CommentNotificationPayload> {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<User> resolve(CommentNotificationPayload notificationPayload) {
        Comment comment = notificationPayload.getComment();
        Post post = comment.getPost();
        User postOwner = post.getUser();
        User commentOwner = comment.getUser();
        return notificationRepository.findAllPostFollowers(
                post,
                List.of(postOwner, commentOwner)
        );
    }
}
