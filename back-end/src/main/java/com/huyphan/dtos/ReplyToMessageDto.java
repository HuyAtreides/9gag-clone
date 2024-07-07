package com.huyphan.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ReplyToMessageDto {

    private long id;

    private MessageContentDto content;

    private boolean deleted;
}
