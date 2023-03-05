package com.huyphan.events;

import com.huyphan.models.Comment;
import com.huyphan.models.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class VoteCommentEvent implements AppEvent {

    private Comment comment;

    @Override
    public EventType getEventType() {
        return EventType.VOTE_COMMENT;
    }
}
