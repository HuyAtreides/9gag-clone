package com.huyphan.models;


import java.time.Instant;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;


@Entity
@Table(name = "ChatConversation")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ChatConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Long id;

    @JoinTable(name = "ChatParticipant",
            joinColumns = @JoinColumn(name = "ConversationId"),
            inverseJoinColumns = @JoinColumn(name = "UserId"))
    @ManyToMany(targetEntity = User.class)
    private Set<ChatParticipant> participants;

    @OneToMany(mappedBy = "conversation")
    private Set<ChatMessage> messages;

    @Column(name = "IsRead", nullable = false)
    private boolean read;

    @Column(name = "Created", nullable = false)
    private Instant created;
    @Transient
    @Setter
    private Long latestChatMessageId;

    public ChatConversation(
            Set<ChatParticipant> participants,
            Set<ChatMessage> messages,
            boolean read
    ) {
        assert participants.size() > 2;

        this.participants = participants;
        this.messages = messages;
        this.read = read;
        this.created = Instant.now();
    }

    public ChatConversation(Set<ChatParticipant> participants) {
        assert participants.size() > 2;

        this.participants = participants;
        this.read = false;
        this.created = Instant.now();
    }

    public void markConversationAsRead(User currentUser) {
        assert participants.contains(currentUser);
        this.read = true;
    }

    public void addMessage(ChatMessage newMessage) {
        ChatParticipant messageSender = newMessage.getOwner();

        if (!hasParticipant(messageSender)) {
            throw new IllegalArgumentException(
                    "The sender doesn't belong to current chat conversation");
        }

        Optional<ChatParticipant> otherParticipant = participants.stream()
                .filter(participant -> !participant.equals(messageSender))
                .findFirst();

        if (otherParticipant.isEmpty()) {
            throw new IllegalArgumentException("Invalid receiver");
        }

        if (!messageSender.canSendMessageTo(otherParticipant.get())) {
            throw new IllegalArgumentException(
                    "Can not send message to other participant in this chat");
        }

        newMessage.associateWithConversation(this);
    }

    public boolean hasParticipant(ChatParticipant participant) {
        return participants.contains(participant);
    }

    public void removeMessage(ChatMessage chatMessage) {
        ChatParticipant participant = chatMessage.getOwner();

        if (!hasParticipant(participant)) {
            throw new IllegalArgumentException(
                    "The participant doesn't belong to current chat conversation");
        }

        chatMessage.removeFromConversation(participant);
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
        ChatConversation that = (ChatConversation) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy
                ? ((HibernateProxy) this).getHibernateLazyInitializer()
                .getPersistentClass().hashCode() : getClass().hashCode();
    }
}
