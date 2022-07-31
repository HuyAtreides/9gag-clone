package com.huyphan.models.enums;

import lombok.Getter;

@Getter
public enum PostSortField {
    Upvotes("upvotes"),
    TotalComments("totalComments"),
    UploadTime("uploadTime");

    private final String value;

    PostSortField(String value) {
        this.value = value;
    }
}
