package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.User;
import com.huyphan.services.UserService;
import com.huyphan.services.notification.payload.VotePostNotificationPayload;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class VotePostNotificationReceiverResolver implements
        NotificationReceiverResolver<VotePostNotificationPayload> {

    @Override
    public List<User> resolve(VotePostNotificationPayload notificationPayload) {
        List<User> users = new ArrayList<>();
        User postUser = notificationPayload.getPost().getUser();
        if (postUser.equals(UserService.getUser())) {
            return users;
        }

        users.add(postUser);
        return users;
    }
}
