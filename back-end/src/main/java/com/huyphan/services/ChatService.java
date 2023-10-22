package com.huyphan.services;

import com.huyphan.controllers.eventemitter.EventEmitter;
import com.huyphan.mediators.IMediator;
import com.huyphan.mediators.MediatorComponent;
import com.huyphan.models.ChatConversation;
import com.huyphan.models.ChatMessage;
import com.huyphan.models.ChatParticipant;
import com.huyphan.models.MessageContent;
import com.huyphan.models.Notification;
import com.huyphan.models.User;
import com.huyphan.models.enums.WebSocketEvent;
import com.huyphan.models.exceptions.UserException;
import com.huyphan.repositories.ChatConversationRepository;
import com.huyphan.repositories.ChatMessageRepository;
import com.huyphan.services.notification.NotificationService;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;
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
        Optional<ChatConversation> optionalChatConversation = chatConversationRepo.findById(
                conversationId);

        if (optionalChatConversation.isEmpty()) {
            throw new IllegalArgumentException("Can not find conversation");
        }

        User currentUser = userService.getCurrentUser();
        ChatConversation chatConversation = optionalChatConversation.get();
        User otherUser = (User) chatConversation.getParticipants().stream()
                .filter(chatParticipant ->
                        !chatParticipant.equals(currentUser)).findFirst().orElseThrow();
        ChatMessage chatMessage = new ChatMessage(messageContent, currentUser);
        chatConversation.addMessage(chatMessage);
        ChatMessage newMessage = chatMessageRepo.save(chatMessage);
        eventEmitter.emitEventTo(WebSocketEvent.RECEIVE_NEW_MESSAGE, otherUser);

        return newMessage;
    }

    @Transactional(readOnly = true)
    public List<ChatMessage> getLatestMessage(Long latestId) {
        User currentUser = userService.getCurrentUser();

        return chatMessageRepo.findLatestChatMessage(currentUser, latestId);
    }

    @Transactional(readOnly = true)
    public Slice<ChatMessage> getConversationChatMessages(Long conversationId) {
        User currentUser = userService.getCurrentUser();

        return chatMessageRepo.getConversationChatMessages(currentUser, conversationId);
    }

    @Transactional(readOnly = true)
    public ChatConversation getConversation(Long conversationId) {
        User currentUser = userService.getCurrentUser();

        return chatMessageRepo.getConversation(currentUser, conversationId).orElseThrow();
    }

    public void editMessage() {

    }

    public void removeMessage() {

    }

    public void initConversation() {

    }

    public void pinMessage() {

    }

    public void getConversationMessages() {

    }

    public void markConversationAsRead() {

    }

    @Transactional
    public ChatConversation createConversationWithUser(Long userId) throws UserException {
        User currentUser = userService.getCurrentUser();
        User otherUser = userService.getUserWithoutDerivedFieldsById(userId);
        Set<ChatParticipant> participants = new HashSet<>(Arrays.asList(currentUser, otherUser));
        ChatConversation chatConversation = new ChatConversation(
                participants
        );

        if (chatConversationRepo.exitsConversationWithParticipants(
                List.of(currentUser, otherUser))) {
            throw new IllegalArgumentException("A conversation between these 2 users exists");
        }

        return chatConversationRepo.save(chatConversation);
    }
}
