package com.huyphan.models;

import com.huyphan.services.OwnedObject;
import java.time.Instant;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ConversationDeleteRecord {

    @ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "DeleteBy")
    private ChatParticipant deleteBy;

    @Column(name = "DeleteAt")
    private Instant deleteAt;

    public ConversationDeleteRecord(@NotNull ChatParticipant deleteBy, @NotNull Instant deleteAt) {
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
