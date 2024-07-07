package com.huyphan.models.enums;

public enum WebSocketEvent {
    RECEIVE_NEW_NOTIFICATION,
    EDIT_MESSAGE,

    REMOVE_MESSAGE,
    PIN_MESSAGE,

    MARK_AS_READ,
    RECEIVE_NEW_MESSAGE,

    VIDEO_OFFER,

    VIDEO_ANSWER,

    NEW_ICE_CANDIDATE,

    BLOCK_USER;
}
