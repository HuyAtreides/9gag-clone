package com.huyphan.services;

import com.huyphan.controllers.eventemitter.EventEmitter;
import com.huyphan.mediators.IMediator;
import com.huyphan.mediators.MediatorComponent;
import com.huyphan.models.ChatConversation;
import com.huyphan.models.ChatConversation_;
import com.huyphan.models.ChatMessage;
import com.huyphan.models.ChatParticipant;
import com.huyphan.models.MessageContent;
import com.huyphan.models.PageOptions;
import com.huyphan.models.User;
import com.huyphan.models.enums.ChatConversationSortField.Constants;
import com.huyphan.models.enums.WebSocketEvent;
import com.huyphan.models.exceptions.UserException;
import com.huyphan.models.projections.ChatConversationWithDerivedFields;
import com.huyphan.repositories.ChatConversationRepository;
import com.huyphan.repositories.ChatMessageRepository;
import com.huyphan.services.notification.NotificationService;
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

    @Override
    public void setMediator(IMediator mediator) {
        this.mediator = mediator;
    }

    @Transactional
    public ChatMessage addMessage(Long conversationId, MessageContent messageContent) {
        User currentUser = UserService.getUser();
        ChatConversation chatConversation = findConversationById(conversationId);
        User otherUser = getOtherParticipantInConversation(chatConversation);
        ChatMessage chatMessage = new ChatMessage(messageContent, currentUser);
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

    private Pageable createChatMessagePageable(PageOptions pageOptions) {
        return PageRequest.of(
                pageOptions.getPage(),
                pageOptions.getSize(),
                Sort.by(Order.desc(ChatConversation_.ID))
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
        Slice<ChatConversationWithDerivedFields> conversationWithDerivedFields = chatConversationRepo.getAllConversationsOfCurrentUser(
                currentUser,
                createChatConversationPageable(pageOptions)
        );

        return conversationWithDerivedFields.map(
                ChatConversationWithDerivedFields::toChatConversation
        );
    }

    @Transactional
    public void editMessage(Long messageId, MessageContent messageContent) {
        ChatMessage chatMessage = findMessageById(messageId);
        ChatConversation chatConversation = chatMessage.getConversation();
        User otherUser = getOtherParticipantInConversation(chatConversation);
        chatMessage.update(messageContent, UserService.getUser());

        eventEmitter.emitEventTo(WebSocketEvent.EDIT_MESSAGE, otherUser);
    }

    private User getOtherParticipantInConversation(ChatConversation conversation) {
        User currentUser = UserService.getUser();
        return (User) conversation.getParticipants().stream()
                .filter(chatParticipant ->
                        !chatParticipant.equals(currentUser)
                ).findFirst().orElseThrow();
    }

    @Transactional
    public void removeMessage(Long messageId) {
        ChatMessage chatMessage = findMessageById(messageId);
        ChatConversation chatConversation = chatMessage.getConversation();
        chatConversation.removeMessage(chatMessage);
        User otherUser = getOtherParticipantInConversation(chatConversation);

        eventEmitter.emitEventTo(WebSocketEvent.REMOVE_MESSAGE, otherUser);
    }

    @Transactional
    public void pinMessage(Long messageId) {
        ChatMessage chatMessage = findMessageById(messageId);
        chatMessage.pinMessage();
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
