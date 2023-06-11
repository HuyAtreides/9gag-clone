package com.huyphan.models.enums;

import lombok.Getter;

@Getter
public enum WebSocketHeader {
    SUB_PROTOCOL("sec-websocket-protocol");

    private final String value;

    WebSocketHeader(String value) {
        this.value = value;
    }
}
