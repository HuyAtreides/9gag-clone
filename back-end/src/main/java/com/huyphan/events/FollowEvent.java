package com.huyphan.events;

import com.huyphan.models.User;
import com.huyphan.models.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FollowEvent implements AppEvent {

    User followedUser;

    @Override
    public EventType getEventType() {
        return EventType.FOLLOW_USER;
    }
}
