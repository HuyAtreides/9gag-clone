package com.huyphan.services.notification.payload;

import com.huyphan.models.User;
import com.huyphan.models.enums.NotificationType;
import com.huyphan.services.UserService;

public interface NotificationPayload {

    NotificationType getNotificationType();

    default User getSender() {
        return UserService.getUser();
    }
}
