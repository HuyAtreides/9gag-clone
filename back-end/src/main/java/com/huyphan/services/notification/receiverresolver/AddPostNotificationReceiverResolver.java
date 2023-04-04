package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.services.notification.payload.AddPostNotificationPayload;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class AddPostNotificationReceiverResolver implements
        NotificationReceiverResolver<AddPostNotificationPayload> {

    @Override
    public List<User> resolve(AddPostNotificationPayload notificationPayload) {
        Post post = notificationPayload.getPost();
        User owner = post.getOwner();
        return owner.getFollowers().stream().toList();
    }
}
