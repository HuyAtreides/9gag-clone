package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.Comment;
import com.huyphan.models.User;
import com.huyphan.services.UserService;
import com.huyphan.services.notification.payload.CommentNotificationPayload;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
@Qualifier("addReplyNotificationReceiverResolver")
public class AddReplyNotificationReceiverResolver implements NotificationReceiverResolver
        <CommentNotificationPayload> {

    @Override
    public List<User> resolve(CommentNotificationPayload notificationPayload) {
        List<User> users = new ArrayList<>();
        Comment comment = notificationPayload.getComment();
        Comment replyTo = comment.getReplyTo();
        User replyToCommentUser = replyTo.getUser();
        if (replyToCommentUser.equals(UserService.getUser()) || !replyTo.isNotificationEnabled()) {
            return users;
        }

        users.add(replyToCommentUser);
        return users;
    }
}
