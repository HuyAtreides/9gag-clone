package com.huyphan.events;

import com.huyphan.models.Post;
import com.huyphan.models.SharedPost;
import com.huyphan.models.User;
import com.huyphan.models.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SharePostEvent implements AppEvent {

    private Long sharedPostContainerId;

    private User sharedPostOwner;

    @Override
    public EventType getEventType() {
        return EventType.SHARE_POST;
    }
}
