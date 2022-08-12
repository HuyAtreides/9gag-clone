package com.huyphan.models;

import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

/**
 * Information required to add new post.
 */
@Getter
@Setter
public class NewPost {

    private String title;

    private String mediaUrl;

    private String mediaType;

    private Section section;

    /**
     * The upload time of this post in ISO format e.g.2022-07-23T00:42:50Z .
     */
    private Instant uploadTime;

    private String tags;
}
