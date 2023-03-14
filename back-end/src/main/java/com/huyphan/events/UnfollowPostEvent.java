package com.huyphan.events;

import com.huyphan.models.Post;
import com.huyphan.models.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UnfollowPostEvent implements AppEvent {

    private Post post;

    @Override
    public EventType getEventType() {
        return EventType.UNFOLLOW_POST;
    }
}