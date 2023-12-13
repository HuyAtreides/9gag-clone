package com.huyphan.dtos;

import com.huyphan.models.MessageContent;
import lombok.Getter;

@Getter
public class NewChatMessageDataDto {
    private MessageContentDto content;

    private String sentDate;
}
