package com.huyphan.events;

import com.huyphan.models.Comment;
import com.huyphan.models.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class CreateCommentEvent implements AppEvent {

    private Comment comment;
    private Long postId;

    @Override
    public EventType getEventType() {
        return EventType.CREATE_COMMENT;
    }
}
