package com.huyphan.services.notification.receiverresolver;

import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.repositories.NotificationRepository;
import com.huyphan.services.notification.payload.AddPostNotificationPayload;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AddPostNotificationReceiverResolver implements
        NotificationReceiverResolver<AddPostNotificationPayload> {

    @Override
    public List<User> resolve(AddPostNotificationPayload notificationPayload) {
        Post post = notificationPayload.getPost();
        User postOwner = post.getUser();
        Set<User> postOwnerFollowers = postOwner.getFollowers();
        Set<User> postOwnerBlocking = postOwner.getBlocking();
        Set<User> blockingPostOwner = postOwner.getBlockedBy();
        postOwnerFollowers.removeAll(postOwnerBlocking);
        postOwnerFollowers.removeAll(blockingPostOwner);

        return postOwnerFollowers.stream().toList();
    }
}
