package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class NewPostDto {

    private String title;

    private String mediaUrl;

    private String mediaType;

    private SectionDto section;

    /**
     * The upload time of this post in ISO format e.g.2022-07-23T00:42:50Z .
     */
    private String uploadTime;

    private String tags;
}
