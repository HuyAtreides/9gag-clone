package com.huyphan.models.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import com.huyphan.models.exceptions.ValueToEnumException;
import java.util.Arrays;

public enum NotificationType {

    VOTE_POST("VotePost"),
    VOTE_COMMENT("VoteComment"),
    ADD_COMMENT("AddComment"),
    ADD_REPLY("AddReply"),
    FOLLOWING_POST_HAS_NEW_COMMENT("FollowingPostHasNewComment"),
    FOLLOWING_COMMENT_HAS_NEW_REPLY("FollowingCommentHasNewReply"),
    ADD_POST("AddPost"),
    FOLLOW_USER("FollowUser"),
    FOLLOW_REQUEST_ACCEPTED("FollowRequestAccepted"),
    SEND_FOLLOW_REQUEST("SendFollowRequest");

    private final String value;

    NotificationType(String value) {
        this.value = value;
    }

    /**
     * Converts string value to Notification type object.
     *
     * @throws ValueToEnumException If the country doesn't exist.
     */
    static public NotificationType toNotificationType(String value) throws ValueToEnumException {
        return Arrays.stream(NotificationType.values()).filter(c -> c.getValue().equals(value))
                .findFirst()
                .orElseThrow(() -> new ValueToEnumException("Notification type doesn't exist."));
    }

    /**
     * Return string value of this enum.
     */
    @JsonValue
    public String getValue() {
        return value;
    }
}
