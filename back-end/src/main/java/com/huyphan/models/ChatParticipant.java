package com.huyphan.models;

public interface ChatParticipant {
    boolean canSendMessageTo(ChatParticipant receiver);
}
