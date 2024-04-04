package com.huyphan.models;


import com.huyphan.services.UserService;
import java.time.Instant;
import java.util.HashSet;
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

    @ElementCollection
    @CollectionTable(name = "ConversationMuteStatus", joinColumns = {
            @JoinColumn(name = "ConversationId")
    })
    private Set<ConversationMuteStatus> muteStatuses;

    @ElementCollection
    @CollectionTable(name = "ConversationDeleteRecord", joinColumns = {
            @JoinColumn(name = "ConversationId")
    })
    private Set<ConversationDeleteRecord> deleteRecords;

    @Column(name = "AllowedChatWithoutFollowing")
    private boolean allowedChatWithoutFollowing;

    public boolean isRestricted() {
        ChatParticipant currentParticipant = getCurrentchatParticipant();

        return currentParticipant.isRestricting(getOtherParticipant(currentParticipant));
    }

    public boolean isUnavailable() {
        ChatParticipant currentParticipant = getCurrentchatParticipant();

        return getOtherParticipant(currentParticipant).isBlocking(currentParticipant);
    }

    public boolean isNeedConfirmationBeforeSendingMessage() {
        ChatParticipant currentParticipant = getCurrentchatParticipant();

        return !allowedChatWithoutFollowing && currentParticipant.isUserMustFollowToChat(
                getOtherParticipant(currentParticipant));
    }

    public boolean isMustFollowToChat() {
        if (allowedChatWithoutFollowing) {
            return false;
        }

        ChatParticipant currentParticipant = getCurrentchatParticipant();

        return getOtherParticipant(currentParticipant).isUserMustFollowToChat(currentParticipant);
    }

    public boolean isBlocked() {
        ChatParticipant currentParticipant = getCurrentchatParticipant();

        return currentParticipant.isBlocking(getOtherParticipant(currentParticipant));
    }

    public void allowChatWithoutFollowing() {
        validateModification();
        this.allowedChatWithoutFollowing = true;
    }

    public boolean isMuted() {
        User currentUser = Objects.requireNonNull(UserService.getUser());

        return muteStatuses.stream().anyMatch(status -> status.ownedBy(currentUser));
    }

    public void mute() {
        User currentUser = Objects.requireNonNull(UserService.getUser());
        validateParticipantInConversation(currentUser);
        validateModification();

        muteStatuses.add(
                new ConversationMuteStatus(
                        currentUser,
                        Instant.now()
                )
        );
    }

    public void unMute() {
        User currentUser = Objects.requireNonNull(UserService.getUser());
        validateParticipantInConversation(currentUser);
        validateModification();

        muteStatuses.removeIf(
                status -> status.ownedBy(currentUser)
        );
    }

    @Column(name = "Created", nullable = false)
    private Instant created;
    @Transient
    @Setter
    private Long latestChatMessageId;

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
        if (isNeedConfirmationBeforeSendingMessage()) {
            throw new IllegalArgumentException(
                    "Need to allow message to be sent from non follower user"
            );
        }

        validateModification();
        ChatParticipant otherParticipant = Optional.ofNullable(
                getOtherParticipant(messageSender)
        ).orElseThrow();

        if (!messageSender.canSendMessageTo(otherParticipant)) {
            throw new IllegalArgumentException(
                    "Can not send message to other participant in this chat");
        }

        if (otherParticipant.isUserMustFollowToChat(messageSender)
                && !isAllowedChatWithoutFollowing()) {
            throw new IllegalArgumentException(
                    "Follow this user to send message.");
        }
    }

    public ChatConversation(Set<ChatParticipant> participants) {
        validateNumberOfParticipants(participants);
        this.participants = participants;
        this.readStatuses = participants.stream().map(
                ConversationReadStatus::new
        ).collect(Collectors.toSet());
        this.muteStatuses = new HashSet<>();
        this.created = Instant.now();
        this.deleteRecords = participants.stream().map(participant ->
                new ConversationDeleteRecord(participant, this.created.minusSeconds(60L))
        ).collect(Collectors.toSet());
        this.allowedChatWithoutFollowing = false;
    }

    private ChatParticipant getCurrentchatParticipant() {
        User currentUser = Objects.requireNonNull(UserService.getUser());

        return participants.stream()
                .filter(currentUser::equals)
                .findAny()
                .orElseThrow();
    }

    public void validateModification() {
        if (isUnavailable() || isBlocked() || isRestricted() || isMustFollowToChat()) {
            throw new IllegalArgumentException("Invalid operation!");
        }
    }

    private Instant getDeleteAt() {
        User currentUser = UserService.getUser();

        return deleteRecords.stream()
                .filter(record -> record.ownedBy(currentUser))
                .findFirst()
                .map(ConversationDeleteRecord::getDeleteAt)
                .orElseGet(() -> Instant.parse("2000-01-01T07:00:30.00Z"));
    }

    public boolean deletedAfterTime(Instant time) {
        return time.isBefore(getDeleteAt());
    }

    public void delete() {
        User currentUser = UserService.getUser();
        validateParticipantInConversation(currentUser);
        validateModification();

        if (this.deleteRecords.stream().noneMatch(record -> record.ownedBy(currentUser))) {
            this.deleteRecords.add(
                    new ConversationDeleteRecord(currentUser, Instant.now())
            );

            return;
        }

        this.deleteRecords = this.deleteRecords.stream().map(record -> {
                    if (!record.ownedBy(currentUser)) {
                        return record;
                    }

                    return record.withNewDeleteAt(Instant.now());
                }
        ).collect(Collectors.toSet());
    }

    public void markConversationAsReadByUser(User user) {
        validateParticipantInConversation(user);
        validateModification();

        this.readStatuses = this.readStatuses.stream().map(status -> {
                    if (status.getReadBy().equals(user)) {
                        return status.withLatestMessagesRead(
                                Instant.now()
                        );
                    }
                    return status;
                }
        ).collect(Collectors.toSet());
    }

    private void markConversationUnReadByUser(User user) {
        validateParticipantInConversation(user);

        this.readStatuses = this.readStatuses.stream().map(status -> {
                    if (status.getReadBy().equals(user)) {
                        return status.withLatestMessagesUnread();
                    }
                    return status;
                }
        ).collect(Collectors.toSet());
    }

    public void addMessage(ChatMessage newMessage) {
        ChatParticipant messageSender = newMessage.getOwner();
        validateParticipantInConversation(messageSender);

        validateMessageCanBeSent(messageSender);
        markConversationUnReadByUser(
                (User) getOtherParticipant(messageSender)
        );

        newMessage.associateWithConversation(this);
    }

    public boolean hasParticipant(ChatParticipant participant) {
        return participants.contains(participant);
    }

    public void removeMessage(ChatMessage chatMessage, User user) {
        validateParticipantInConversation(user);
        validateModification();
        chatMessage.markAsDeleted(user);
    }

    public ChatParticipant getOtherParticipant(ChatParticipant currentParticipant) {
        return getParticipants().stream()
                .filter(chatParticipant ->
                        !chatParticipant.equals(currentParticipant)
                ).findFirst().orElseThrow();
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
        Long id = getId();

        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy
                ? ((HibernateProxy) this).getHibernateLazyInitializer()
                .getPersistentClass().hashCode() : getClass().hashCode();
    }
}
