package com.huyphan.models.enums;

import lombok.Getter;

@Getter
public enum PostSortField {
    UPVOTES("upvotes"),
    TOTAL_COMMENTS("totalComments"),
    ID("id");

    private final String value;

    PostSortField(String value) {
        this.value = value;
    }
}
