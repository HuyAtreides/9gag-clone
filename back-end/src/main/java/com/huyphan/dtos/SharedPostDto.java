package com.huyphan.dtos;

import com.huyphan.models.enums.PostContentType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SharedPostDto {

    private Long id;

    private UserDto originalPoster;

    private boolean anonymous;

    private SectionDto section;

    private String uploadTime;

    private PostContentType contentType;

    private String text;

    private String title;

    private String mediaUrl;

    private String mediaType;
}
