package com.huyphan.models.projections;

import com.huyphan.models.User;
import java.time.Instant;

public interface UserWithDerivedFields {

    User getUser();

    boolean getIsFollowedByCurrentUser();

    boolean getIsReceivedFollowRequestFromCurrentUser();

    boolean getBlocked();

    boolean getIsRestricted();

    Instant getRestrictedAt();

    Instant getBlockedTime();

    default User toUser() {
        User user = getUser();
        user.setFollowed(getIsFollowedByCurrentUser());
        user.setReceivedFollowRequest(getIsReceivedFollowRequestFromCurrentUser());
        user.setBlocked(getBlocked());
        user.setBlockedTime(getBlockedTime());
        user.setRestricted(getIsRestricted());
        user.setRestrictedAt(getRestrictedAt());

        return user;
    }
}
