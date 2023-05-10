package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.services.UserService;
import com.huyphan.services.notification.payload.VotePostNotificationPayload;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class VotePostNotificationReceiverResolver implements
        NotificationReceiverResolver<VotePostNotificationPayload> {

    @Override
    public List<User> resolve(VotePostNotificationPayload notificationPayload) {
        List<User> users = new ArrayList<>();
        Post post = notificationPayload.getPost();
        User postOwner = post.getUser();
        if (postOwner.equals(UserService.getUser()) || !post.isNotificationEnabled()) {
            return users;
        }

        users.add(postOwner);
        return users;
    }
}
