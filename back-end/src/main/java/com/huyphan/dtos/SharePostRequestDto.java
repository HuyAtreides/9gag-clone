package com.huyphan.dtos;

import com.huyphan.models.Section;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class SharePostRequestDto {
    private String title;

    private Section section;

    private Long sharedPostId;
}
