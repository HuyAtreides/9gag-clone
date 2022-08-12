package com.huyphan.models;

import java.time.Instant;
import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;

/**
 * Information required to add new comment.
 */
@Getter
@Setter
public class NewComment {

    @Nullable
    private String text;

    @Nullable
    private String mediaUrl;

    @Nullable
    private String mediaType;

    @Nullable
    private Long replyToId;

    private Instant date;
}
