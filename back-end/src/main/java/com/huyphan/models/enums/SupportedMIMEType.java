package com.huyphan.models.enums;

import lombok.Getter;

@Getter
public enum SupportedMIMEType {
    VIDEO_MPEG("video/mpeg"),
    VIDEO_MP4("video/mp4"),
    IMAGE_GIF("image/gif"),
    IMAGE_JPEG("image/jpeg"),
    IMAGE_WEBP("image/webp"),
    IMAGE_PNG("image/png"),
    IMAGE_SVG("image/svg+xml");

    private final String value;

    SupportedMIMEType(String value) {
        this.value = value;
    }
}
