package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.User;
import com.huyphan.services.notification.payload.FollowRequestAcceptedNotificationPayload;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class FollowRequestAcceptedReceiverResolver
        implements NotificationReceiverResolver<FollowRequestAcceptedNotificationPayload> {

    @Override
    public List<User> resolve(FollowRequestAcceptedNotificationPayload notificationPayload) {
        User user = notificationPayload.getRequestSender();
        return List.of(user);
    }
}
