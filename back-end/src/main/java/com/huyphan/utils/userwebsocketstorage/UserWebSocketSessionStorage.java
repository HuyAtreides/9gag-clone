package com.huyphan.utils.userwebsocketstorage;

import java.util.List;

public interface UserWebSocketSessionStorage<WebSocketSessionType> {
    List<WebSocketSessionType> getSessionOf(long userId);

    void addSessionOf(WebSocketSessionType session, long userId);

    void removeSessionOf(WebSocketSessionType deletingSession, long userId);
}
