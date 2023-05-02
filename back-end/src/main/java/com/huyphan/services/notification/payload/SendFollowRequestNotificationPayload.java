package com.huyphan.services.notification.payload;

import com.huyphan.models.User;
import com.huyphan.models.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SendFollowRequestNotificationPayload implements NotificationPayload {

    private User receiver;

    private Long requestId;

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.SEND_FOLLOW_REQUEST;
    }
}