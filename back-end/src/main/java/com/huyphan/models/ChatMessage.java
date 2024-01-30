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
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

@Entity
@Table(name = "ChatMessage")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@NamedEntityGraph(name = "ChatMessageWithConversationInfo", attributeNodes = {
        @NamedAttributeNode("conversation"),
        @NamedAttributeNode("replyToMessage")
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

    @Column(name = "Deleted")
    private boolean deleted;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ChatConversationId")
    private ChatConversation conversation;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ReplyToId")
    private ChatMessage replyToMessage;

    @ManyToOne(targetEntity = User.class)
    @JoinColumn(name = "OwnerId")
    private ChatParticipant owner;

    public ChatMessage(MessageContent content, ChatParticipant owner) {
        validateContentNotNull(content);
        this.content = new MessageContent(
                content.getMediaUrl(),
                content.getMediaType(),
                content.getText(),
                content.getOriginalFileName()
        );
        Instant now = Instant.now();
        this.owner = owner;
        this.sentDate = now;
        this.lastEditDate = now;
        this.deleted = false;
        this.pinned = false;
        this.edited = false;
    }

    public void replyTo(ChatMessage message) {
        if (!message.getConversation().equals(this.getConversation())) {
            throw new IllegalArgumentException(
                    "Can not reply to message in different conversation");
        }

        validateIsNotDeleted();
        conversation.validateModification();
        this.replyToMessage = message;
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

    public void pinMessage(ChatParticipant participant) {
        if (!conversation.hasParticipant(participant)) {
            throw new IllegalArgumentException("User not in this conversation");
        }

        validateIsNotDeleted();
        conversation.validateModification();
        this.pinned = true;
    }

    public void unPinMessage(ChatParticipant participant) {
        if (!conversation.hasParticipant(participant)) {
            throw new IllegalArgumentException("User not in this conversation");
        }

        validateIsNotDeleted();
        conversation.validateModification();
        this.pinned = false;
    }

    public void associateWithConversation(ChatConversation conversation) {
        this.conversation = conversation;
    }

    public void markAsDeleted(ChatParticipant participant) {
        validateIsNotDeleted();
        validateIsOwnedByParticipant(participant);
        conversation.validateModification();
        this.deleted = true;
    }

    public MessageContent getContent() {
        return deleted ? MessageContent.empty() : content;
    }

    public boolean isPinned() {
        return !deleted && pinned;
    }

    public boolean isEdited() {
        return !deleted && edited;
    }

    private void validateIsOwnedByParticipant(ChatParticipant chatParticipant) {
        if (!owner.equals(chatParticipant)) {
            throw new IllegalArgumentException("Participant is not the owner of this message");
        }
    }

    private void validateIsNotDeleted() {
        if (deleted || this.conversation.deletedAfterTime(sentDate)) {
            throw new IllegalArgumentException("This message is deleted");
        }
    }

    private void validateContentNotNull(MessageContent content) {
        if (content == null) {
            throw new IllegalArgumentException("New content should not be null");
        }
    }

    public void update(MessageContent newContent, ChatParticipant chatParticipant) {
        validateIsNotDeleted();
        validateIsOwnedByParticipant(chatParticipant);
        validateContentNotNull(newContent);
        this.content = this.content.withNewContent(
                newContent.getMediaUrl(),
                newContent.getMediaType(),
                newContent.getText()
        );
        conversation.validateModification();
        this.lastEditDate = Instant.now();
        this.edited = true;
    }

}