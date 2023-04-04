package com.huyphan.services.togglesendnotificationsinvoker;

import com.huyphan.models.User;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.services.UserService;
import org.springframework.stereotype.Component;

@Component
public class ToggleSendNotificationsInvoker implements IToggleSendNotificationsInvoker {

    @Override
    public void toggle(ToggleableSendNotifications toggleableSendNotifications, boolean value)
            throws PostException {
        User invoker = UserService.getUser();

        if (!toggleableSendNotifications.getOwner().equals(invoker)) {
            throw new PostException("Post not found");
        }

        toggleableSendNotifications.setNotificationEnabled(value);

    }
}
