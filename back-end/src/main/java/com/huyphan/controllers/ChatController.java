package com.huyphan.controllers;

import com.huyphan.dtos.ChatConversationDto;
import com.huyphan.dtos.ChatMessageDto;
import com.huyphan.dtos.MessageContentDto;
import com.huyphan.dtos.SliceDto;
import com.huyphan.mappers.ChatMessageMapper;
import com.huyphan.mappers.ConversationMapper;
import com.huyphan.mappers.MessageContentMapper;
import com.huyphan.mappers.SliceMapper;
import com.huyphan.models.ChatConversation;
import com.huyphan.models.ChatMessage;
import com.huyphan.models.MessageContent;
import com.huyphan.models.User;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.UserException;
import com.huyphan.services.ChatService;
import java.time.Instant;
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
    private MessageContentMapper messageContentMapper;

    @Autowired
    private ChatMessageMapper chatMessageMapper;

    @Autowired
    private SliceMapper<ChatMessageDto, ChatMessage> sliceMapper;

    @PostMapping("add-message/{conversationId}")
    public ChatMessageDto sendMessage(@PathVariable Long conversationId,
            @RequestBody MessageContentDto messageContentDto) {
        MessageContent messageContent = messageContentMapper.fromDto(messageContentDto);
        ChatMessage chatMessage = chatService.addMessage(conversationId, messageContent);

        return chatMessageMapper.toDto(chatMessage);
    }

    @GetMapping("conversation-messages/{conversationId}")
    public SliceDto<ChatMessageDto> getConversationChatMessages(@PathVariable Long conversationId) {
        Slice<ChatMessage> chatMessages = chatService.getConversationChatMessages(conversationId);

        return sliceMapper.toDto(chatMessages, chatMessageMapper);
    }

    @GetMapping("conversation/{id}")
    public ChatConversationDto getConversation(@PathVariable Long id) {
        ChatConversation conversation = chatService.getConversation(id);

        return conversationMapper.toDto(conversation);
    }

    @PutMapping("edit-message/{messageId}")
    public void editMessage(@PathVariable Long messageId) {

    }

    @GetMapping("latest-message/:latestId")
    public List<ChatMessageDto> getLatestChatMessage(@PathVariable Long latestId) {
        return null;
    }

    @PutMapping("pin-message")
    public void pinMessage() {

    }

    @PutMapping("mark-as-read")
    public void markConversationAsRead() {

    }

    @DeleteMapping("message")
    public void removeMessage() {

    }

    @GetMapping("messages")
    public void getConversationMessages() {

    }

    @GetMapping
    public void getConversation() {

    }

    @PutMapping("create/{userId}")
    public ChatConversationDto createConversationWithUser(@PathVariable Long userId)
            throws UserException {
        ChatConversation chatConversation = chatService.createConversationWithUser(userId);

        return conversationMapper.toDto(chatConversation);
    }

    @ExceptionHandler({AppException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppException handleExceptions(AppException exception) {
        return exception;
    }
}
