package com.huyphan.services.notification.builders;

import com.huyphan.models.Notification;
import com.huyphan.models.enums.NotificationType;
import com.huyphan.services.notification.payload.NotificationPayload;
import java.util.List;

/**
 * Build a notification bases on the subject type.
 *
 * @param <PayloadType> Type of the subject that causes the notification.
 */
public interface NotificationBuilder<PayloadType extends NotificationPayload> {

    List<Notification> build(PayloadType subject);

    String buildDestUrl(PayloadType subject);

    NotificationType getNotificationType();
}
