package com.huyphan.events;

import com.huyphan.models.User;
import com.huyphan.models.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class FollowRequestAcceptedEvent implements AppEvent {

    private User requestSender;

    @Override
    public EventType getEventType() {
        return EventType.FOLLOW_REQUEST_ACCEPTED;
    }
}
