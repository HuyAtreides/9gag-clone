package com.huyphan.models;

import java.time.Instant;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.data.jpa.repository.EntityGraph;

@Entity
@Table(name = "ChatMessage")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@NamedEntityGraph(name = "ChatMessageWithConversationInfo", attributeNodes = {
        @NamedAttributeNode("conversation")
})
@Setter(AccessLevel.PRIVATE)
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Embedded
    private MessageContent content;

    @Column(name = "LastEditDate")
    private Instant lastEditDate;

    @Column(name = "SentDate")
    private Instant sentDate;

    @Column(name = "Pinned")
    private boolean pinned;

    @Column(name = "Edited")
    private boolean edited;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ChatConversationId")
    private ChatConversation conversation;

    @ManyToOne(targetEntity = User.class)
    @JoinColumn(name = "OwnerId")
    private ChatParticipant owner;

    public ChatMessage(MessageContent content, ChatParticipant owner) {
        this.content = content;
        this.owner = owner;
        this.sentDate = Instant.now();
        this.lastEditDate = Instant.now();
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null) {
            return false;
        }
        Class<?> oEffectiveClass = o instanceof HibernateProxy
                ? ((HibernateProxy) o).getHibernateLazyInitializer()
                .getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy
                ? ((HibernateProxy) this).getHibernateLazyInitializer()
                .getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) {
            return false;
        }
        ChatMessage that = (ChatMessage) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy
                ? ((HibernateProxy) this).getHibernateLazyInitializer()
                .getPersistentClass().hashCode() : getClass().hashCode();
    }

    public void pinMessage() {
        this.pinned = true;
    }

    public void associateWithConversation(ChatConversation conversation) {
        this.conversation = conversation;
    }

    public void removeFromConversation(ChatParticipant participant) {
        if (!owner.equals(participant)) {
            throw new IllegalArgumentException(
                    "Deleting message isn't owned by the participant"
            );
        }

        this.conversation = null;
    }

    public void update(MessageContent newContent, ChatParticipant chatParticipant) {
        if (!owner.equals(chatParticipant)) {
            throw new IllegalArgumentException("You can't update other message");
        }

        this.content = newContent;
        this.lastEditDate = Instant.now();
        this.edited = true;
    }

}