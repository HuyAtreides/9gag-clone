package com.huyphan.events;

import com.huyphan.models.Post;
import com.huyphan.models.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FollowPostEvent implements AppEvent {

    private Post post;

    @Override
    public EventType getEventType() {
        return EventType.FOLLOW_POST;
    }
}