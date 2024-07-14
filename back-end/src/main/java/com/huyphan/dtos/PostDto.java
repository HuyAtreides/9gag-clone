package com.huyphan.dtos;

import com.huyphan.models.converters.PostContentTypeConverter;
import com.huyphan.models.enums.PostContentType;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Lob;
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
    private String text;

    private PostContentType contentType;

    private int downvotes;

    private int upvotes;

    private SectionDto section;

    private UserDto user;

    /**
     * The upload time of this post in ISO format e.g.2022-07-23T00:42:50Z .
     */
    private String uploadTime;

    private Long sharedPostId;

    private boolean notificationEnabled;

    private String tags;

    private Long totalComments;

    private Boolean isUpvoted;

    private Boolean isDownvoted;

    private Boolean isSaved;

    private boolean followed;
    private boolean anonymous;

    private boolean nsfw;

    private boolean moderating;

    private boolean followersOnly;
}
