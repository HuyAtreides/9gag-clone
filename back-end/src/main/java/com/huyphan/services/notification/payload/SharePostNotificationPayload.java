package com.huyphan.services.notification.payload;

import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.models.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SharePostNotificationPayload implements NotificationPayload {

    private Long sharedPostContainerId;

    private User sharedPostOwner;

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.SHARE_POST;
    }
}
