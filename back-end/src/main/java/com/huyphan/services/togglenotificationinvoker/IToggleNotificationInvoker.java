package com.huyphan.services.togglesendnotificationsinvoker;

import com.huyphan.models.exceptions.PostException;

public interface IToggleSendNotificationsInvoker {

    void toggle(ToggleableSendNotifications toggleableSendNotifications, boolean value)
            throws PostException;
}
