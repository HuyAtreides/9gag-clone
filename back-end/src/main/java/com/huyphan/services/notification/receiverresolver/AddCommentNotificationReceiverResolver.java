package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.User;
import com.huyphan.services.UserService;
import com.huyphan.services.notification.payload.CommentNotificationPayload;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
@Qualifier("addCommentNotificationReceiverResolver")
public class AddCommentNotificationReceiverResolver implements NotificationReceiverResolver<
        CommentNotificationPayload> {

    @Override
    public List<User> resolve(CommentNotificationPayload notificationPayload) {
        List<User> users = new ArrayList<>();
        User postUser = notificationPayload.getComment().getPost().getUser();
        if (postUser.equals(UserService.getUser())) {
            return users;
        }

        users.add(postUser);
        return users;
    }
}
