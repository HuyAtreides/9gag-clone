package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.Comment;
import com.huyphan.models.User;
import com.huyphan.repositories.NotificationRepository;
import com.huyphan.services.notification.payload.CommentNotificationPayload;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
@Qualifier("commentFollowersResolver")
public class CommentFollowersResolver implements
        NotificationReceiverResolver<CommentNotificationPayload> {

    @Autowired
    NotificationRepository notificationRepository;

    @Override
    public List<User> resolve(CommentNotificationPayload notificationPayload) {
        Comment comment = notificationPayload.getComment();
        User commentOwner = comment.getOwner();
        Comment replyTo = comment.getReplyTo();
        return notificationRepository.findAllCommentFollowers(
                replyTo
                , List.of(commentOwner));
    }
}
