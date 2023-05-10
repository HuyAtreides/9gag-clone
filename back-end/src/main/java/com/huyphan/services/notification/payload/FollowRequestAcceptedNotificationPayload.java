package com.huyphan.services.notification.payload;

import com.huyphan.models.User;
import com.huyphan.models.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FollowRequestAcceptedNotificationPayload implements NotificationPayload{

    private User requestSender;

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.FOLLOW_REQUEST_ACCEPTED;
    }
}
