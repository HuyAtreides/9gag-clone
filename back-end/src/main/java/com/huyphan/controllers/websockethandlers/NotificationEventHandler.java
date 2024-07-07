package com.huyphan.controllers.websockethandlers;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.huyphan.models.enums.WebSocketHeader;
import com.huyphan.utils.userwebsocketstorage.UserWebSocketSessionStorage;
import java.io.IOException;
import java.util.IllegalFormatCodePointException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@Slf4j
public class NotificationEventHandler extends TextWebSocketHandler {

    @Autowired
    private UserWebSocketSessionStorage<WebSocketSession> sessionStorage;

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
            throws Exception {
        String userIdAsString = session.getHandshakeHeaders()
                .get(WebSocketHeader.SUB_PROTOCOL.getValue()).get(0);
        sessionStorage.removeSessionOf(session, Long.parseLong(userIdAsString));
        super.afterConnectionClosed(session, status);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message)
            throws Exception {
        String payload = message.getPayload();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(payload);
        long userId = jsonNode.get("targetUserId").asLong(-1);

        if (userId == -1) {
            throw new IllegalArgumentException("User id is required when send message to WebSocket");
        }

        log.info("wsMessage={}, message=receive ws message", message.getPayload());

        sessionStorage.getSessionOf(userId).forEach(
                webSocketSession ->
                {
                    try {
                        if (webSocketSession.isOpen()) {
                            webSocketSession.sendMessage(message);
                        }
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
        );
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userIdAsString = session.getHandshakeHeaders()
                .get(WebSocketHeader.SUB_PROTOCOL.getValue()).get(0);
        sessionStorage.addSessionOf(session, Long.parseLong(userIdAsString));
        super.afterConnectionEstablished(session);
    }
}
