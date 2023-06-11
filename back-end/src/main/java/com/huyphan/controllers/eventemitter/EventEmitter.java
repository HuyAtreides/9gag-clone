package com.huyphan.controllers.eventemitter;

import com.huyphan.models.User;
import com.huyphan.models.enums.WebSocketEvent;
import java.io.IOException;

public interface EventEmitter {

    void emitEventTo(WebSocketEvent event, User receiver);
}
