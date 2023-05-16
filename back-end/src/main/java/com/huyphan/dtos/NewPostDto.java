package com.huyphan.dtos;

import com.huyphan.models.enums.PostContentType;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class NewPostDto {

    private String title;

    private String mediaUrl;

    private String mediaType;

    private SectionDto section;

    private String tags;

    private String text;

    private PostContentType contentType;

    private boolean anonymous;

    private boolean notificationEnabled;
}
