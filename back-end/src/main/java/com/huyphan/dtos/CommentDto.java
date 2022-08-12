package com.huyphan.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;

@Getter
@Setter
public class CommentDto {

    private Long id;

    @Nullable
    private String text;

    @Nullable
    private String mediaUrl;

    private int upvotes;

    private int downvotes;

    @Nullable
    private String mediaType;

    @Nullable
    @JsonInclude(Include.NON_NULL)
    private CommentDto replyTo;

    private String date;

    @Nullable
    private UserDto user;

    private Long totalChildren;
}
