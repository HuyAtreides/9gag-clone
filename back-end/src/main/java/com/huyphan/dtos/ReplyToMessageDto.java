package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReplyToMessageDto {

    private long id;

    private MessageContentDto content;

    private boolean deleted;
}
