package com.huyphan.models.enums;

import com.huyphan.models.enums.PostSortField.Constants;
import lombok.Getter;

@Getter
public enum ChatConversationSortField {
    LATEST_MESSAGE_ID(ChatConversationSortField.Constants.LATEST_MESSAGE_ID);
    private final String value;

    ChatConversationSortField(String value) {
        this.value = value;
    }

    public static class Constants {
        public static final String LATEST_MESSAGE_ID = "latestChatMessageId";
    }
}
