package com.huyphan.models.projections;

import com.huyphan.models.ChatConversation;

public interface ChatConversationWithDerivedFields {
    ChatConversation getChatConversation();

    Long getLatestChatMessageId();

    default ChatConversation toChatConversation() {
        ChatConversation conversation = getChatConversation();
        Long latestChatMessageId = getLatestChatMessageId();
        conversation.setLatestChatMessageId(latestChatMessageId == null ? 0 : latestChatMessageId);

        return conversation;
    }
}
