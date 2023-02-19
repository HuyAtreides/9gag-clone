package com.huyphan.models.enums;

import lombok.Getter;

@Getter
public enum CommentSortField {
    UPVOTES("upvotes"),
    DATE("date"),
    TOTAL_CHILDREN("totalChildren");

    private final String value;

    CommentSortField(String value) {
        this.value = value;
    }
}
