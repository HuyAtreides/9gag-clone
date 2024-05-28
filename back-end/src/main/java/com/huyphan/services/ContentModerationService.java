package com.huyphan.services;

public interface ContentModerationService {
    void updateContentModerationStatus(boolean isNSFW, String contentUrl);
}
