package com.huyphan.models.enums;

import lombok.Getter;

@Getter
public enum PostSortField {
    UPVOTES("upvotes"),
    TOTAL_COMMENTS("totalComments"),
    UPLOAD_TIME("uploadTime");

    private final String value;

    PostSortField(String value) {
        this.value = value;
    }
}
