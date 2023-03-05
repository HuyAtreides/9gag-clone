package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.User;
import com.huyphan.services.UserService;
import com.huyphan.services.notification.payload.CommentNotificationPayload;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
@Qualifier("voteCommentNotificationReceiverResolver")
public class VoteCommentNotificationReceiverResolver implements
        NotificationReceiverResolver<CommentNotificationPayload> {

    @Override
    public List<User> resolve(CommentNotificationPayload notificationPayload) {
        List<User> users = new ArrayList<>();
        User commentUser = notificationPayload.getComment().getUser();
        if (commentUser.equals(UserService.getUser())) {
            return users;
        }

        users.add(commentUser);
        return users;
    }
}
