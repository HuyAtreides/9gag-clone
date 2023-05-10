package com.huyphan.events;

import com.huyphan.models.enums.EventType;

public interface AppEvent {

    EventType getEventType();
}
