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
import lombok.NonNull;

@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ConversationDeleteRecord {

    @ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "DeleteBy")
    private ChatParticipant deleteBy;

    @Column(name = "DeleteAt")
    private Instant deleteAt;

    public ConversationDeleteRecord(@NonNull ChatParticipant deleteBy, @NonNull Instant deleteAt) {
        this.deleteAt = deleteAt;
        this.deleteBy = deleteBy;
    }

    public ConversationDeleteRecord withNewDeleteAt(Instant deleteAt) {
        return new ConversationDeleteRecord(this.deleteBy, deleteAt);
    }

    public boolean ownedBy(ChatParticipant chatParticipant) {
        return chatParticipant.equals(deleteBy);
    }

}
