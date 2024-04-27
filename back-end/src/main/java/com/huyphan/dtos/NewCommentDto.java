package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;

@Setter
@Getter
public class NewCommentDto {

    @Nullable
    private String text;

    @Nullable
    private String mediaUrl;

    @Nullable
    private String mediaType;

    private boolean nsfw;
}
