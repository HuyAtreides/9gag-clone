package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.User;
import com.huyphan.services.notification.payload.NotificationPayload;
import java.util.List;

public interface NotificationReceiverResolver<T extends NotificationPayload> {

    List<User> resolve(T notificationPayload);
}
