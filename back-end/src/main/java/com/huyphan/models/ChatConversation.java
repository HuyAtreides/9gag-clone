package com.huyphan.models;


import java.time.Instant;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
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

    @ElementCollection
    @CollectionTable(name = "ConversationReadStatus", joinColumns = {
            @JoinColumn(name = "ConversationId")
    })
    private Set<ConversationReadStatus> readStatuses;

    @Column(name = "Created", nullable = false)
    private Instant created;
    @Transient
    @Setter
    private Long latestChatMessageId;

    public ChatConversation(
            Set<ChatParticipant> participants,
            Set<ChatMessage> messages
    ) {
        validateNumberOfParticipants(participants);
        this.readStatuses = participants.stream().map(
                ConversationReadStatus::new
        ).collect(Collectors.toSet());
        this.participants = participants;
        this.messages = messages;
        this.created = Instant.now();
    }

    private void validateNumberOfParticipants(Set<ChatParticipant> participants) {
        if (participants.size() != 2) {
            throw new IllegalArgumentException("Number of participants should be 2");
        }
    }

    private void validateParticipantInConversation(ChatParticipant participant) {
        if (!hasParticipant(participant)) {
            throw new IllegalArgumentException("Participant is not in this conversation");
        }
    }

    private void validateMessageCanBeSent(ChatParticipant messageSender) {
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
    }

    private void validateLatestMessageIdIsValid() {
        if (latestChatMessageId == null || latestChatMessageId <= 0) {
            throw new IllegalArgumentException("Invalid latest message ID");
        }
    }

    public ChatConversation(Set<ChatParticipant> participants) {
        validateNumberOfParticipants(participants);
        this.participants = participants;
        this.readStatuses = participants.stream().map(
                ConversationReadStatus::new
        ).collect(Collectors.toSet());
        this.created = Instant.now();
    }

    public void markConversationAsReadByUser(User user) {
        validateParticipantInConversation(user);
        validateLatestMessageIdIsValid();

        this.readStatuses = this.readStatuses.stream().map(status -> {
                    if (status.getReadBy().equals(user)) {
                        return status.withNewReadAt(
                                Instant.now()
                        ).withNewLatestReadMessageId(this.latestChatMessageId);
                    }
                    return status;
                }
        ).collect(Collectors.toSet());
    }

    public void addMessage(ChatMessage newMessage) {
        ChatParticipant messageSender = newMessage.getOwner();
        validateParticipantInConversation(messageSender);

        validateMessageCanBeSent(messageSender);

        newMessage.associateWithConversation(this);
    }

    public boolean hasParticipant(ChatParticipant participant) {
        return participants.contains(participant);
    }

    public void removeMessage(ChatMessage chatMessage) {
        ChatParticipant participant = chatMessage.getOwner();
        validateParticipantInConversation(participant);
        chatMessage.markAsDeleted(participant);
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
