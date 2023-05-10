package com.huyphan.services.togglenotificationinvoker;

import com.huyphan.models.User;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.services.UserService;
import org.springframework.stereotype.Component;

@Component
public class ToggleNotificationInvoker implements IToggleNotificationInvoker {

    @Override
    public void toggle(Notifiable notifiable, boolean value)
            throws PostException {
        User invoker = UserService.getUser();

        if (!notifiable.getOwner().equals(invoker)) {
            throw new PostException("Post not found");
        }

        notifiable.setNotificationEnabled(value);

    }
}
