package com.huyphan.models.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import com.huyphan.models.exceptions.ValueToEnumException;
import java.util.Arrays;
import lombok.Getter;

@Getter
public enum SupportedMIMEType {
    VIDEO_MPEG("video/mpeg"),
    VIDEO_MP4("video/mp4"),
    IMAGE_GIF("image/gif"),
    GIF("gif"),
    FILE("file"),
    IMAGE_JPEG("image/jpeg"),
    IMAGE_WEBP("image/webp"),
    IMAGE_PNG("image/png"),
    IMAGE_SVG("image/svg+xml");

    private final String value;

    SupportedMIMEType(String value) {
        this.value = value;
    }

    static public SupportedMIMEType toSupportedMIMEType(String value) {
        return Arrays.stream(SupportedMIMEType.values()).filter(c -> c.getValue().equals(value))
                .findFirst()
                .orElse(SupportedMIMEType.FILE);
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
