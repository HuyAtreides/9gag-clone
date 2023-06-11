package com.huyphan.controllers.eventemitter;

import com.huyphan.models.User;
import com.huyphan.models.enums.WebSocketEvent;
import com.huyphan.utils.userwebsocketstorage.UserWebSocketSessionStorage;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Component
public class ConcreteEventEmitter implements EventEmitter {

    @Autowired
    private UserWebSocketSessionStorage<WebSocketSession> sessionStorage;

    @Override
    public void emitEventTo(WebSocketEvent event, User receiver) {
        List<WebSocketSession> sessions = sessionStorage.getSessionOf(receiver.getId());

        sessions.forEach(session ->
                {
                    try {
                        if (session.isOpen()) {
                            session.sendMessage(new TextMessage(event.toString(), true));
                        }

                    } catch (IOException e) {
                        e.fillInStackTrace();
                    }
                }
        );

    }
}
