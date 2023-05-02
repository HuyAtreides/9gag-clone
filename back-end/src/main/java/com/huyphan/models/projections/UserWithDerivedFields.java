package com.huyphan.models.projections;

import com.huyphan.models.User;

public interface UserWithDerivedFields {
    User getUser();

    boolean getIsFollowedByCurrentUser();

    boolean getIsReceivedFollowRequestFromCurrentUser();

    default User toUser() {
        User user = getUser();
        user.setFollowed(getIsFollowedByCurrentUser());
        user.setReceivedFollowRequest(getIsReceivedFollowRequestFromCurrentUser());

        return user;
    }
}
