package com.huyphan.services;

import com.huyphan.models.Notification;
import com.huyphan.models.User;

/**
 * Service for sending notifications.
 */
public interface NotificationSender {

    void send(Notification notification, User receiver);
}
