package com.huyphan.models.enums;


import com.fasterxml.jackson.annotation.JsonValue;
import com.huyphan.models.Post;
import com.huyphan.models.exceptions.ValueToEnumException;
import java.util.Arrays;

public enum PostContentType {
    MEDIA("MEDIA"),
    TEXT("TEXT"),
    SHARED_POST("SHARED_POST");

    private final String value;

    PostContentType(String value) {
        this.value = value;
    }

    static public PostContentType toPostContentType(String value) throws ValueToEnumException {
        return Arrays.stream(PostContentType.values()).filter(c -> c.getValue().equals(value))
                .findFirst()
                .orElseThrow(() -> new ValueToEnumException("Post content type doesn't exist."));
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
