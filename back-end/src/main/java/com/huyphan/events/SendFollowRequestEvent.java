package com.huyphan.events;

import com.huyphan.models.User;
import com.huyphan.models.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class SendFollowRequestEvent implements AppEvent {

    private User receiver;

    private Long requestId;

    @Override
    public EventType getEventType() {
        return EventType.SEND_FOLLOW_REQUEST;
    }
}
