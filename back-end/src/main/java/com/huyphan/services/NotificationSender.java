package com.huyphan.services;

/**
 * Service for sending notifications.
 *
 * @param <SubjectType> Type of the subject that sends the notification.
 */
public interface NotificationSenderService<SubjectType> {

    void send(SubjectType subject);
}
