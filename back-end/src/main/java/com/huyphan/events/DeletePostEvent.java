package com.huyphan.events;

import com.huyphan.models.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class DeletePostEvent implements AppEvent {

    private Long postId;

    @Override
    public EventType getEventType() {
        return EventType.DELETE_POST;
    }
}
