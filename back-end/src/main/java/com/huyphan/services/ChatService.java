package com.huyphan.services;

import com.huyphan.controllers.eventemitter.EventEmitter;
import com.huyphan.mediators.IMediator;
import com.huyphan.mediators.MediatorComponent;
import com.huyphan.models.ChatConversation;
import com.huyphan.models.ChatMessage;
import com.huyphan.models.ChatMessage_;
import com.huyphan.models.ChatParticipant;
import com.huyphan.models.MessageContent;
import com.huyphan.models.NewChatMessageData;
import com.huyphan.models.PageOptions;
import com.huyphan.models.User;
import com.huyphan.models.enums.ChatConversationSortField.Constants;
import com.huyphan.models.enums.WebSocketEvent;
import com.huyphan.models.exceptions.UserException;
import com.huyphan.models.projections.ChatConversationWithDerivedFields;
import com.huyphan.repositories.ChatConversationRepository;
import com.huyphan.repositories.ChatMessageRepository;
import com.huyphan.services.notification.NotificationService;
import com.huyphan.utils.AWSS3Util;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatService implements MediatorComponent {

    @Autowired
    private ChatMessageRepository chatMessageRepo;

    @Autowired
    private ChatConversationRepository chatConversationRepo;

    @Autowired
    private NotificationService notificationService;

    private IMediator mediator;

    @Autowired
    private UserService userService;

    @Autowired
    private EventEmitter eventEmitter;

    @Autowired
    private AWSS3Util awss3Util;

    @Override
    public void setMediator(IMediator mediator) {
        this.mediator = mediator;
    }

    @Transactional
    public ChatMessage addMessage(Long conversationId, NewChatMessageData newChatMessageData) {
        User currentUser = UserService.getUser();
        ChatConversation chatConversation = findConversationById(conversationId);
        User otherUser = getOtherParticipantInConversation(chatConversation);
        Instant sentDate = newChatMessageData.getSentDate();
        MessageContent messageContent = newChatMessageData.getContent();

        if (sentDate == null) {
            throw new IllegalArgumentException("Send date can not be null");
        }

        ChatMessage chatMessage = new ChatMessage(messageContent, currentUser, sentDate);
        chatConversation.addMessage(chatMessage);
        ChatMessage newMessage = chatMessageRepo.save(chatMessage);
        eventEmitter.emitEventTo(WebSocketEvent.RECEIVE_NEW_MESSAGE, otherUser);

        return newMessage;
    }

    @Transactional(readOnly = true)
    public List<ChatConversation> findAllConversationWithNewestMessage(Long latestMessageId) {
        User currentUser = UserService.getUser();

        return chatConversationRepo.findAllConversationWithNewestMessage(
                currentUser,
                latestMessageId
        ).stream().map(ChatConversationWithDerivedFields::toChatConversation).toList();
    }

    @Transactional(readOnly = true)
    public List<ChatMessage> findAllLatestChatMessage(Long latestMessageId) {
        User currentUser = UserService.getUser();

        return chatMessageRepo.findAllLatestChatMessages(
                currentUser,
                latestMessageId
        );
    }

    private Pageable createChatMessagePageable(PageOptions pageOptions) {
        return PageRequest.of(
                pageOptions.getPage(),
                pageOptions.getSize(),
                Sort.by(Order.desc(ChatMessage_.SENT_DATE), Order.desc(ChatMessage_.ID))
        );
    }

    private Pageable createChatConversationPageable(PageOptions pageOptions) {
        return PageRequest.of(
                pageOptions.getPage(),
                pageOptions.getSize(),
                JpaSort.unsafe(Direction.DESC,
                        "(" + Constants.LATEST_MESSAGE_ID + ")")
        );
    }

    @Transactional(readOnly = true)
    public Slice<ChatMessage> getConversationChatMessages(
            Long conversationId,
            PageOptions pageOptions
    ) {
        User currentUser = UserService.getUser();
        Pageable pageable = createChatMessagePageable(pageOptions);

        return chatMessageRepo.getConversationChatMessages(currentUser, conversationId, pageable);
    }

    @Transactional(readOnly = true)
    public Slice<ChatConversation> getAllConversationsOfCurrentUser(PageOptions pageOptions) {
        User currentUser = UserService.getUser();

        return chatConversationRepo.getAllConversationsOfCurrentUser(
                currentUser,
                createChatConversationPageable(pageOptions)
        ).map(ChatConversationWithDerivedFields::toChatConversation);
    }

    @Transactional(readOnly = true)
    public Slice<ChatConversation> getCurrentUserNonEmptyConversations(PageOptions pageOptions) {
        User currentUser = UserService.getUser();
        Slice<ChatConversationWithDerivedFields> conversations;

        if (pageOptions.getSearch() != null) {
            conversations = chatConversationRepo.searchConversationsOfCurrentUser(
                    currentUser,
                    "%" + pageOptions.getSearch() + "%",
                    createChatConversationPageable(pageOptions)
            );
        } else {
            conversations = chatConversationRepo.getCurrentUserNonEmptyConversations(
                    currentUser,
                    createChatConversationPageable(pageOptions)
            );

        }

        return conversations.map(
                ChatConversationWithDerivedFields::toChatConversation
        );
    }

    @Transactional
    public void editMessage(Long messageId, MessageContent messageContent) {
        ChatMessage chatMessage = findMessageById(messageId);
        String currentMediaUrl = chatMessage.getContent().getMediaUrl();
        ChatConversation chatConversation = chatMessage.getConversation();
        User otherUser = getOtherParticipantInConversation(chatConversation);
        chatMessage.update(messageContent, UserService.getUser());

        if (currentMediaUrl != null && !currentMediaUrl.equals(messageContent.getMediaUrl())) {
            awss3Util.deleteObject(currentMediaUrl);
        }

        eventEmitter.emitEventTo(WebSocketEvent.EDIT_MESSAGE, otherUser);
    }

    @Transactional
    public void deleteConversation(Long conversationId) {

    }

    private User getOtherParticipantInConversation(ChatConversation conversation) {
        User currentUser = UserService.getUser();
        return (User) conversation.getOtherParticipantInConversation(currentUser);
    }

    @Transactional
    public void removeMessage(Long messageId) {
        ChatMessage chatMessage = findMessageById(messageId);
        ChatConversation chatConversation = chatMessage.getConversation();
        chatConversation.removeMessage(chatMessage, UserService.getUser());
        User otherUser = getOtherParticipantInConversation(chatConversation);

        eventEmitter.emitEventTo(WebSocketEvent.REMOVE_MESSAGE, otherUser);
    }

    @Transactional(readOnly = true)
    public List<ChatMessage> findAllChatMessagesInRange(
            Long oldestMessageId,
            Long newestMessageId
    ) {
        User currentUser = UserService.getUser();

        return chatMessageRepo.findAllChatMessagesInRange(
                currentUser,
                oldestMessageId,
                newestMessageId
        );
    }

    @Transactional(readOnly = true)
    public List<ChatMessage> findConversationChatMessagesInRange(
            Long conversationId,
            Long oldestMessageId,
            Long newestMessageId
    ) {
        ChatConversation chatConversation = findConversationById(conversationId);
        User currentUser = UserService.getUser();

        if (!chatConversation.hasParticipant(currentUser)) {
            throw new IllegalArgumentException("User not in this conversation");
        }

        return chatMessageRepo.findConversationChatMessagesInRange(
                chatConversation,
                oldestMessageId,
                newestMessageId
        );
    }

    @Transactional(readOnly = true)
    public int getConversationOldestMessageId(Long conversationId) {
        ChatConversation chatConversation = findConversationById(conversationId);
        User currentUser = UserService.getUser();

        if (!chatConversation.hasParticipant(currentUser)) {
            throw new IllegalArgumentException("User not in this conversation");
        }

        Integer id = chatMessageRepo.getConversationOldestMessageId(chatConversation);

        return id == null ? -1 : id;
    }

    @Transactional
    public ChatMessage replyTo(Long messageId, NewChatMessageData newMessageData) {
        ChatMessage replyToMessage = findMessageById(messageId);
        ChatMessage newMessage = addMessage(replyToMessage.getConversation().getId(),
                newMessageData);
        newMessage.replyTo(replyToMessage);

        return newMessage;
    }

    @Transactional(readOnly = true)
    public Slice<ChatMessage> findAllPinnedMessage(
            Long conversationId,
            PageOptions pageOptions
    ) {
        ChatConversation chatConversation = findConversationById(conversationId);
        User user = UserService.getUser();

        if (!chatConversation.hasParticipant(user)) {
            throw new IllegalArgumentException("User not in conversation");
        }

        return chatMessageRepo.findAllPinnedMessages(
                chatConversation,
                createChatMessagePageable(pageOptions)
        );
    }

    @Transactional
    public void pinMessage(Long messageId) {
        ChatMessage chatMessage = findMessageById(messageId);
        chatMessage.pinMessage(UserService.getUser());
        User otherUser = getOtherParticipantInConversation(chatMessage.getConversation());

        eventEmitter.emitEventTo(WebSocketEvent.PIN_MESSAGE, otherUser);
    }

    @Transactional
    public void unPinMessage(Long messageId) {
        ChatMessage chatMessage = findMessageById(messageId);
        chatMessage.unPinMessage(UserService.getUser());
        User otherUser = getOtherParticipantInConversation(chatMessage.getConversation());

        eventEmitter.emitEventTo(WebSocketEvent.PIN_MESSAGE, otherUser);
    }

    @Transactional
    public void markConversationAsRead(Long conversationId) {
        ChatConversation conversation = findConversationWithDerivedFieldsById(conversationId);
        User currentUser = UserService.getUser();
        User otherUser = getOtherParticipantInConversation(conversation);
        conversation.markConversationAsReadByUser(currentUser);

        eventEmitter.emitEventTo(WebSocketEvent.MARK_AS_READ, otherUser);
    }

    @Transactional
    public void markAllAsRead() {
        User currentUser = UserService.getUser();
        List<ChatConversation> unreadConversations = chatConversationRepo.findAllUnreadConversation(
                currentUser
        );

        unreadConversations.forEach(conversation -> {
            markConversationAsRead(conversation.getId());
        });
    }

    @Transactional
    public ChatConversation createConversationWithUser(Long userId) throws UserException {
        User currentUser = UserService.getUser();
        User otherUser = userService.getUserWithoutDerivedFieldsById(userId);
        Set<ChatParticipant> participants = new HashSet<>(Arrays.asList(currentUser, otherUser));
        Optional<ChatConversation> conversationWithParticipants = chatConversationRepo.findConversationWithParticipants(
                participants
        );

        if (conversationWithParticipants.isPresent()) {
            return conversationWithParticipants.get();
        }

        ChatConversation chatConversation = new ChatConversation(
                participants
        );

        return chatConversationRepo.save(chatConversation);
    }

    public ChatConversation getConversation(Long id) {
        return findConversationWithDerivedFieldsById(id);
    }

    public int countUnreadConversations() {
        return chatConversationRepo.countUnreadConversation(
                UserService.getUser()
        );
    }

    public ChatMessage getMessage(Long id) {
        return findMessageById(id);
    }

    private ChatMessage findMessageById(Long id) {
        return chatMessageRepo.findById(id).orElseThrow();
    }

    private ChatConversation findConversationById(Long id) {
        return chatConversationRepo.findById(id).orElseThrow();
    }

    private ChatConversation findConversationWithDerivedFieldsById(Long id) {
        return chatConversationRepo.findConversationWithDerivedFieldsById(id).toChatConversation();
    }
}
