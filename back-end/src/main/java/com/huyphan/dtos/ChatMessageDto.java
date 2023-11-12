package com.huyphan.dtos;

import com.huyphan.models.MessageContent;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageDto {
    private long id;

    private MessageContentDto content;

    private Long conversationId;

    private String lastEditDate;
    private String sentDate;

    private boolean pinned;

    private boolean edited;

    private boolean deleted;
    private UserDto owner;
}
