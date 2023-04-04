package com.huyphan.services.togglenotificationinvoker;

import com.huyphan.models.exceptions.AppException;

public interface IToggleNotificationInvoker {

    void toggle(Notifiable notifiable, boolean value)
            throws AppException;
}
