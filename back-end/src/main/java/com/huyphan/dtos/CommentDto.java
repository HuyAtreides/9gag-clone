package com.huyphan.dtos;

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
    private UserDto replyTo;

    private String date;

    @Nullable
    private UserDto user;

    private Long totalChildren;

    private boolean isUpvoted;

    private boolean isDownvoted;
    private boolean notificationEnabled;
    private Long parentId;

    private boolean followed;

    private Long postId;

    private Long replyToId;

    private boolean nsfw;

    public boolean getIsDownvoted() {
        return isDownvoted;
    }

    public boolean getIsUpvoted() {
        return isUpvoted;
    }
}
