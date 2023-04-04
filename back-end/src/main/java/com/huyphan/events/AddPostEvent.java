package com.huyphan.events;

import com.huyphan.models.Post;
import com.huyphan.models.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AddPostEvent implements AppEvent {

    private Post post;

    @Override
    public EventType getEventType() {
        return EventType.ADD_POST;
    }
}
