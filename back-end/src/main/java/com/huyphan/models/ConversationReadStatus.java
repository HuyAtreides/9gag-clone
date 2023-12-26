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

    @Column(name = "AreLatestMessagesRead")
    private boolean latestMessagesRead;

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

    private ConversationReadStatus(
            ChatParticipant readBy,
            Instant readAt,
            boolean latestMessagesRead
    ) {
        validateReadByNotNull(readBy);
        validateReadAtNotNull(readAt);
        this.readBy = readBy;
        this.readAt = readAt;
        this.latestMessagesRead = latestMessagesRead;
    }

    public ConversationReadStatus(
            ChatParticipant readBy
    ) {
        validateReadByNotNull(readBy);
        this.readBy = readBy;
    }

    public ConversationReadStatus withLatestMessagesRead(Instant readAt) {
        return new ConversationReadStatus(
                this.readBy,
                readAt,
                true
        );
    }

    public ConversationReadStatus withLatestMessagesUnread() {
        ConversationReadStatus newReadStatus = new ConversationReadStatus(this.readBy);
        newReadStatus.readAt = this.readAt;
        newReadStatus.latestMessagesRead = false;

        return newReadStatus;
    }
}
