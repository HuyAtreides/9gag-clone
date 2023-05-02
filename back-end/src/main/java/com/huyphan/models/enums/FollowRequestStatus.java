package com.huyphan.models.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum FollowRequestStatus {
    PENDING,
    ACCEPTED,
    DECLINED;

    @JsonValue
    public int getValue() {
        return ordinal();
    }
}
