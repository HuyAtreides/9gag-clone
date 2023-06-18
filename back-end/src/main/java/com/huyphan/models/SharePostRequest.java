package com.huyphan.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SharePostRequest {
    private String title;

    private Section section;

    private Long sharedPostId;
}
