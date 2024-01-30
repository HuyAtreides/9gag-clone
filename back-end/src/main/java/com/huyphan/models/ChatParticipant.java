package com.huyphan.models;

public interface ChatParticipant {
    boolean canSendMessageTo(ChatParticipant receiver);

    boolean isRestricting(ChatParticipant participant);

    boolean isBlocking(ChatParticipant participant);

    boolean isUserMustFollowToChat(ChatParticipant participant);
}
