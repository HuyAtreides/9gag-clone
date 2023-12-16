package com.huyphan.models;

import java.time.Instant;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ConversationReadStatus {

    @ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "UserId")
    private ChatParticipant readBy;

    @Column(name = "ReadAt")
    private Instant readAt;

    private void validateReadByNotNull(ChatParticipant readBy) {
        if (readBy == null) {
            throw new IllegalArgumentException("Read by can not be null");
        }
    }

    private void validateReadAtNotNull(Instant readAt) {
        if (readAt == null) {
            throw new IllegalArgumentException("Read at can not be null");
        }
    }

    private void validateLatestReadMessageIdIsValid(Long latestReadMessageId) {
        if (latestReadMessageId == null || latestReadMessageId <= 0) {
            throw new IllegalArgumentException("Invalid latest read message ID");
        }
    }

    public ConversationReadStatus(
            ChatParticipant readBy,
            Instant readAt,
            Long latestReadMessageId
    ) {
        validateReadByNotNull(readBy);
        validateReadAtNotNull(readAt);
        validateLatestReadMessageIdIsValid(latestReadMessageId);
        this.readBy = readBy;
        this.readAt = readAt;
        this.latestReadMessageId = latestReadMessageId;
    }

    public ConversationReadStatus(
            ChatParticipant readBy,
            Instant readAt
    ) {
        validateReadByNotNull(readBy);
        validateReadAtNotNull(readAt);
        this.readBy = readBy;
        this.readAt = readAt;
    }

    @Column(name = "LatestReadMessageId")
    private Long latestReadMessageId;

    public ConversationReadStatus(
            ChatParticipant readBy
    ) {
        validateReadByNotNull(readBy);
        this.readBy = readBy;
    }

    public ConversationReadStatus withNewReadAt(Instant readAt) {
        return new ConversationReadStatus(
                this.readBy,
                readAt
        );
    }

    public ConversationReadStatus withNewLatestReadMessageId(Long latestReadMessageId) {
        return new ConversationReadStatus(
                this.readBy,
                this.readAt,
                latestReadMessageId
        );
    }
}
