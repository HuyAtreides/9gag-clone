package com.huyphan.services.notification;

import com.huyphan.models.exceptions.AppException;
import com.huyphan.services.notification.payload.NotificationPayload;

/**
 * Service for sending notifications.
 */
public interface NotificationSender {

    void send(NotificationPayload notificationPayload) throws AppException;
}
