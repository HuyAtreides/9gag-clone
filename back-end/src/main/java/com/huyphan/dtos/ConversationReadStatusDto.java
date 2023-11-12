package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConversationReadStatusDto {
    private UserDto readBy;

    private String readAt;

    private Long latestReadMessageId;
}
