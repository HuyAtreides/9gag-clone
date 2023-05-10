package com.huyphan.services.followactioninvoker;

import com.huyphan.models.User;
import com.huyphan.services.UserService;
import org.springframework.stereotype.Component;

@Component
public class FollowActionInvoker implements IFollowActionInvoker {

    @Override
    public void unFollow(Followable followable) {
        User follower = UserService.getUser();

        if (follower.equals(followable.getOwner())) {
            return;
        }

        followable.getFollowers().remove(follower);
    }

    @Override
    public void follow(User follower, Followable followable) {
        if (follower.equals(followable.getOwner())) {
            return;
        }

        followable.getFollowers().add(follower);
    }

    @Override
    public void follow(Followable followable) {
        User follower = UserService.getUser();
        follow(follower,followable);
    }
}
