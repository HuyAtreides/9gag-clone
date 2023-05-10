package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.User;
import com.huyphan.services.notification.payload.FollowUserNotificationPayload;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class FollowUserNotificationReceiverResolver implements
        NotificationReceiverResolver<FollowUserNotificationPayload> {

    @Override
    public List<User> resolve(FollowUserNotificationPayload notificationPayload) {
        User user = notificationPayload.getFollowedUser();
        return List.of(user);
    }
}
