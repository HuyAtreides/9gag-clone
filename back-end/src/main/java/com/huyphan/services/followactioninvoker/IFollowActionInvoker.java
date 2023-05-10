package com.huyphan.services.followactioninvoker;

import com.huyphan.models.User;

public interface IFollowActionInvoker {

    void follow(Followable followable);

    void unFollow(Followable followable);

    void follow(User follower, Followable followed);
}
