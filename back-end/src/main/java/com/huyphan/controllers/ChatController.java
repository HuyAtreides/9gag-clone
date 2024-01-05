package com.huyphan.controllers;

import com.huyphan.dtos.ChatConversationDto;
import com.huyphan.dtos.ChatMessageDto;
import com.huyphan.dtos.MessageContentDto;
import com.huyphan.dtos.NewChatMessageDataDto;
import com.huyphan.dtos.PageOptionsDto;
import com.huyphan.dtos.SliceDto;
import com.huyphan.mappers.ChatMessageMapper;
import com.huyphan.mappers.ConversationMapper;
import com.huyphan.mappers.MessageContentMapper;
import com.huyphan.mappers.NewChatMessageDataMapper;
import com.huyphan.mappers.PageOptionMapper;
import com.huyphan.mappers.SliceMapper;
import com.huyphan.models.ChatConversation;
import com.huyphan.models.ChatMessage;
import com.huyphan.models.MessageContent;
import com.huyphan.models.NewChatMessageData;
import com.huyphan.models.PageOptions;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.UserException;
import com.huyphan.services.ChatService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private ConversationMapper conversationMapper;

    @Autowired
    private NewChatMessageDataMapper newChatMessageDataMapper;

    @Autowired
    private MessageContentMapper messageContentMapper;

    @Autowired
    private ChatMessageMapper chatMessageMapper;

    @Autowired
    private PageOptionMapper pageOptionMapper;

    @Autowired
    private SliceMapper<ChatMessageDto, ChatMessage> messageSliceMapper;

    @Autowired
    private SliceMapper<ChatConversationDto, ChatConversation> conversationSliceMapper;

    @PostMapping("add-message/{conversationId}")
    public ChatMessageDto sendMessage(@PathVariable Long conversationId,
            @RequestBody NewChatMessageDataDto newChatMessageDataDto) {
        NewChatMessageData newChatMessageData = newChatMessageDataMapper.fromDto(
                newChatMessageDataDto);
        ChatMessage chatMessage = chatService.addMessage(conversationId, newChatMessageData);

        return chatMessageMapper.toDto(chatMessage);
    }

    @GetMapping("message/{messageId}")
    public ChatMessageDto getMessage(@PathVariable Long messageId) {
        ChatMessage chatMessage = chatService.getMessage(messageId);

        return chatMessageMapper.toDto(chatMessage);
    }

    @GetMapping("conversations")
    public SliceDto<ChatConversationDto> getAllConversationsOfCurrentUser(
            PageOptionsDto pageOptionsDto
    ) {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<ChatConversation> chatConversations = chatService.getAllConversationsOfCurrentUser(
                pageOptions
        );

        return conversationSliceMapper.toDto(chatConversations, conversationMapper);
    }

    @GetMapping("count/unread")
    public int countUnreadConversations() {
        return chatService.countUnreadConversations();
    }

    @GetMapping("conversation/{id}")
    public ChatConversationDto getConversation(@PathVariable Long id) {
        return conversationMapper.toDto(chatService.getConversation(id));
    }

    @GetMapping("non-empty-conversations")
    public SliceDto<ChatConversationDto> getCurrentUserNonEmptyConversations(
            PageOptionsDto pageOptionsDto
    ) {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<ChatConversation> chatConversations = chatService.getCurrentUserNonEmptyConversations(
                pageOptions
        );

        return conversationSliceMapper.toDto(chatConversations, conversationMapper);
    }

    @PutMapping("edit-message/{messageId}")
    public void editMessage(
            @PathVariable Long messageId,
            @RequestBody MessageContentDto newMessageContentDto
    ) {
        MessageContent messageContent = messageContentMapper.fromDto(newMessageContentDto);
        chatService.editMessage(messageId, messageContent);
    }

    @GetMapping("conversations-with-newest-messages/{latestMessageId}")
    public List<ChatConversationDto> getAllConversationWithNewestMessage(
            @PathVariable Long latestMessageId
    ) {
        List<ChatConversation> chatConversations = chatService.findAllConversationWithNewestMessage(
                latestMessageId
        );

        return chatConversations.stream().map(chatConversation ->
                conversationMapper.toDto(chatConversation)
        ).toList();
    }

    @GetMapping("latest-chat-messages/{latestMessageId}")
    public List<ChatMessageDto> getAllLatestChatMessages(
            @PathVariable Long latestMessageId
    ) {
        List<ChatMessage> messages = chatService.findAllLatestChatMessage(
                latestMessageId
        );

        return messages.stream().map(message ->
                chatMessageMapper.toDto(message)
        ).toList();
    }

    @PutMapping("message/pin/{messageId}")
    public void pinMessage(@PathVariable Long messageId) {
        chatService.pinMessage(messageId);
    }

    @PutMapping("message/unpin/{messageId}")
    public void unPinMessage(@PathVariable Long messageId) {
        chatService.unPinMessage(messageId);
    }

    @PutMapping("mark-as-read/{conversationId}")
    public void markConversationAsRead(@PathVariable Long conversationId) {
        chatService.markConversationAsRead(conversationId);
    }

    @PutMapping("mark-all-as-read")
    public void markAllAsRead() {
        chatService.markAllAsRead();
    }

    @DeleteMapping("message/{messageId}")
    public void removeMessage(@PathVariable Long messageId) {
        chatService.removeMessage(messageId);
    }

    @DeleteMapping("conversation/{conversationId}")
    public void deleteConversation(@PathVariable Long conversationId) {
        //TODO
    }

    @GetMapping("messages/{conversationId}")
    public SliceDto<ChatMessageDto> getConversationMessages(
            @PathVariable Long conversationId,
            PageOptionsDto pageOptionsDto
    ) {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<ChatMessage> chatMessages = chatService.getConversationChatMessages(
                conversationId,
                pageOptions
        );

        return messageSliceMapper.toDto(chatMessages, chatMessageMapper);
    }

    @PutMapping("create/{userId}")
    public ChatConversationDto createConversationWithUser(@PathVariable Long userId)
            throws UserException {
        ChatConversation chatConversation = chatService.createConversationWithUser(userId);

        return conversationMapper.toDto(chatConversation);
    }

    @GetMapping("all-message/in-range/{oldestMessageId}/{latestMessageId}")
    public List<ChatMessageDto> findAllChatMessagesInRange(
            @PathVariable Long oldestMessageId,
            @PathVariable Long latestMessageId
    ) {
        List<ChatMessage> allPossibleUpdatedMessages = chatService.findAllChatMessagesInRange(
                oldestMessageId,
                latestMessageId
        );

        return allPossibleUpdatedMessages.stream().map(message -> chatMessageMapper.toDto(message))
                .toList();
    }

    @GetMapping("message/{conversationId}/in-range/{oldestMessageId}/{latestMessageId}")
    public List<ChatMessageDto> findAllChatMessagesInRange(
            @PathVariable Long conversationId,
            @PathVariable Long oldestMessageId,
            @PathVariable Long latestMessageId
    ) {
        List<ChatMessage> allPossibleUpdatedMessages = chatService.findConversationChatMessagesInRange(
                conversationId,
                oldestMessageId,
                latestMessageId
        );

        return allPossibleUpdatedMessages.stream().map(message -> chatMessageMapper.toDto(message))
                .toList();
    }

    @GetMapping("conversation/{conversationId}/oldest-message-id")
    public int getConversationOldestId(@PathVariable Long conversationId) {
        return chatService.getConversationOldestMessageId(conversationId);
    }

    @GetMapping("message/pinned/{conversationId}")
    public SliceDto<ChatMessageDto> findAllPinnedMessage(
            @PathVariable Long conversationId,
            PageOptionsDto pageOptionsDto
    ) {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<ChatMessage> slice = chatService.findAllPinnedMessage(conversationId, pageOptions);

        return messageSliceMapper.toDto(slice, chatMessageMapper);
    }

    @ExceptionHandler({AppException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppException handleExceptions(AppException exception) {
        return exception;
    }
}
