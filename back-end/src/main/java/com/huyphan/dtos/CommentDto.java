package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;

@Getter
@Setter
public class CommentDto {

    @Nullable
    private Long id;

    @Nullable
    private String text;

    @Nullable
    private String mediaUrl;

    private int upvotes;

    private int downvotes;

    private String mediaType;

    @Nullable
    private CommentDto replyTo;

    private String date;
}
