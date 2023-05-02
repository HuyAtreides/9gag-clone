package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.User;
import com.huyphan.services.notification.payload.SendFollowRequestNotificationPayload;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class SendFollowRequestReceiverResolver implements
        NotificationReceiverResolver<SendFollowRequestNotificationPayload> {

    @Override
    public List<User> resolve(SendFollowRequestNotificationPayload notificationPayload) {
        User user = notificationPayload.getReceiver();
        return List.of(user);
    }
}
