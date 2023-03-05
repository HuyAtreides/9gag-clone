package com.huyphan.services.notification.payload;

import com.huyphan.models.Post;
import com.huyphan.models.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class VotePostNotificationPayload implements NotificationPayload {

    private Post post;

    @Override
    public NotificationType getNotificationType() {
        return NotificationType.VOTE_POST;
    }
}
