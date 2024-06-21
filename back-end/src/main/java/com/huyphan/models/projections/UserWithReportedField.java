package com.huyphan.models.projections;

import com.huyphan.models.User;

public interface UserWithReportedField {

    boolean getReported();

    User getUser();

    default User toUser() {
        User user = getUser();
        user.setReported(getReported());

        return user;
    }

}
