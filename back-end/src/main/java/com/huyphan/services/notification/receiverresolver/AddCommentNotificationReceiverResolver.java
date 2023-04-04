package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.Post;
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
        Post post = notificationPayload.getComment().getPost();
        User postOwner = post.getUser();
        if (postOwner.equals(UserService.getUser()) || !post.isNotificationEnabled()) {
            return users;
        }

        users.add(postOwner);
        return users;
    }
}
