package com.huyphan.dtos;

import java.util.List;
import javax.persistence.Transient;
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

    private boolean muted;

    private boolean restricted;

    private boolean unavailable;

    private boolean blocked;

    private boolean mustFollowToChat;
}
