package com.huyphan.models.enums;

import lombok.Getter;

@Getter
public enum FollowRequestDirection {
    SENT("sent"),
    RECEIVED("received");

    private final String value;

    FollowRequestDirection(String value) {
        this.value = value;
    }
}
