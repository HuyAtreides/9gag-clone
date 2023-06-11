package com.huyphan.controllers.websockethandlers;


import com.huyphan.models.enums.WebSocketHeader;
import com.huyphan.utils.userwebsocketstorage.UserWebSocketSessionStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
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
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userIdAsString = session.getHandshakeHeaders()
                .get(WebSocketHeader.SUB_PROTOCOL.getValue()).get(0);
        sessionStorage.addSessionOf(session, Long.parseLong(userIdAsString));
        super.afterConnectionEstablished(session);
    }
}
