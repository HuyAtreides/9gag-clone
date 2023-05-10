package com.huyphan.events;

import com.huyphan.models.Comment;
import com.huyphan.models.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AddReplyEvent implements AppEvent {

    private Comment reply;

    @Override
    public EventType getEventType() {
        return EventType.ADD_REPLY;
    }
}
