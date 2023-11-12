package com.huyphan.dtos;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatConversationDto {
    private long id;

    private List<UserDto> participants;

    private List<ConversationReadStatusDto> readStatuses;

    private Long latestChatMessageId;

    private String created;
}
