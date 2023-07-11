package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.services.UserService;
import com.huyphan.services.notification.payload.SharePostNotificationPayload;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class SharePostReceiverResolver implements NotificationReceiverResolver<SharePostNotificationPayload> {

    @Override
    public List<User> resolve(SharePostNotificationPayload notificationPayload) {
        User currentUser = UserService.getUser();

        User sharedPostOwner = notificationPayload.getSharedPostOwner();

        if (sharedPostOwner.equals(currentUser)) {
            return List.of();
        }

        return List.of(sharedPostOwner);
    }
}
