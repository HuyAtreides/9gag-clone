package com.huyphan.models.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum EventType {
    DELETE_POST,
    VOTE_POST,
    GET_POST,
    SAVE_POST,
    VOTE_COMMENT,
    CREATE_COMMENT,
    ADD_REPLY,
    ADD_POST,
    FOLLOW_USER,
    SEND_FOLLOW_REQUEST,

    SHARE_POST,
    FOLLOW_REQUEST_ACCEPTED;
}
