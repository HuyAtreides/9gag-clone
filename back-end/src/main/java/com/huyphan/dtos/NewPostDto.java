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

    private String tags;
}
