package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
public class PostDto {

    private Long id;

    private String title;

    private String mediaUrl;

    private String mediaType;

    private int downvotes;

    private int upvotes;

    private SectionDto section;

    private UserDto user;

    /**
     * The upload time of this post in ISO format e.g.2022-07-23T00:42:50Z .
     */
    private String uploadTime;

    private boolean notificationEnabled;

    private String tags;

    private Long totalComments;

    private Boolean isUpvoted;

    private Boolean isDownvoted;

    private Boolean isSaved;

    private boolean followed;
    private boolean anonymous;
}
