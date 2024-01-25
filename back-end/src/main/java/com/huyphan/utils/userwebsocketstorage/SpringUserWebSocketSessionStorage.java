package com.huyphan.utils.userwebsocketstorage;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class SpringUserWebSocketSessionStorage implements
        UserWebSocketSessionStorage<WebSocketSession> {

    private final ConcurrentHashMap<Long, List<WebSocketSession>> sessions = new ConcurrentHashMap<>();

    @Override
    public List<WebSocketSession> getSessionOf(long userId) {
        return sessions.getOrDefault(userId, new ArrayList<>());
    }

    @Override
    public void addSessionOf(WebSocketSession session, long userId) {
        List<WebSocketSession> currentWebSocketSessionsOfUser = getSessionOf(userId);
        currentWebSocketSessionsOfUser.add(session);
        sessions.putIfAbsent(userId, currentWebSocketSessionsOfUser);
    }

    @Override
    public void removeSessionOf(WebSocketSession deletingSession, long userId) {
        List<WebSocketSession> currentWebSocketSessionsOfUser = getSessionOf(userId);
        currentWebSocketSessionsOfUser.removeIf(session ->
                session.getId().equals(deletingSession.getId())
        );

        if (currentWebSocketSessionsOfUser.isEmpty()) {
            sessions.remove(userId);
        }
    }
}
