package com.huyphan.models.builders;

import com.huyphan.models.Notification;

/**
 * Build a notification bases on the subject type.
 *
 * @param <SubjectType> Type of the subject that causes the notification.
 */
public interface NotificationBuilder<SubjectType> {

    Notification build(SubjectType subject);

    String buildDestUrl(SubjectType subject);
}
