package com.huyphan.models;

import java.time.Instant;
import java.util.Objects;
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
public class ConversationMuteStatus {

    @ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "UserId")
    private ChatParticipant muteBy;

    @Column(name = "MuteAt")
    private Instant muteAt;

    public ConversationMuteStatus(@NonNull ChatParticipant muteBy, @NonNull Instant muteAt) {
        this.muteBy = muteBy;
        this.muteAt = muteAt;
    }

    public boolean ownedBy(ChatParticipant user) {
        return user.equals(muteBy);
    }
}
