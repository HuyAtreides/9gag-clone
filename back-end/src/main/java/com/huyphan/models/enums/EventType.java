package com.huyphan.models.enums;

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
}
