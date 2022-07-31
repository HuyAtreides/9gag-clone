package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;

@Getter
@Setter
public class PostDto {

    @Nullable
    private Long id;

    private String title;

    private String mediaUrl;

    private String mediaType;

    private int downvotes;

    private int upvotes;

    private SectionDto section;

    /**
     * The upload time of this post in ISO format e.g.2022-07-23T00:42:50Z .
     */
    private String uploadTime;

    private long totalComments;

    private String tags;
}
