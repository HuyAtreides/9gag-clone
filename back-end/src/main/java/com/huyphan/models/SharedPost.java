package com.huyphan.models;

import com.huyphan.models.enums.PostContentType;
import java.time.Instant;

public interface SharedPost {

    Long getId();

    User getOriginalPoster();

    boolean isAnonymous();

    Section getSection();

    Instant getUploadTime();

    String getMediaType();

    PostContentType getContentType();

    String getTitle();

    String getText();
}
