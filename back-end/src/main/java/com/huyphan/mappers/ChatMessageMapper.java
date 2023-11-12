package com.huyphan.mappers;

import com.huyphan.dtos.ChatMessageDto;
import com.huyphan.dtos.MessageContentDto;
import com.huyphan.dtos.UserDto;
import com.huyphan.models.ChatConversation;
import com.huyphan.models.ChatMessage;
import com.huyphan.models.ChatParticipant;
import com.huyphan.models.MessageContent;
import com.huyphan.models.User;
import java.time.Instant;
import org.modelmapper.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ChatMessageMapper extends BaseMapper implements
        ToDtoMapper<ChatMessageDto, ChatMessage> {

    @Autowired
    private Converter<Instant, String> instantToStringConverter;

    @Override
    public ChatMessageDto toDto(ChatMessage data) {
        return modelMapper.map(data, ChatMessageDto.class);
    }

    @Autowired
    private Converter<String, Instant> stringToInstantConverter;

    @Override
    public void createTypeMap() {
        Converter<ChatConversation, Long> converter = (context) -> {
            ChatConversation conversation = context.getSource();

            return conversation.getId();
        };

        Converter<ChatParticipant, UserDto> userConverter = (context) -> {
            User participant = (User) context.getSource();

            return modelMapper.map(participant, UserDto.class);
        };

        Converter<MessageContent, MessageContentDto> messageContentConverter = (context) ->
                modelMapper.map(context.getSource(), MessageContentDto.class);

        modelMapper.createTypeMap(ChatMessage.class, ChatMessageDto.class)
                .addMappings(
                        mapper -> mapper.using(instantToStringConverter)
                                .map(ChatMessage::getSentDate, ChatMessageDto::setSentDate)
                )
                .addMappings(
                        mapper -> mapper.using(converter)
                                .map(ChatMessage::getConversation,
                                        ChatMessageDto::setConversationId)

                )
                .addMappings(
                        mapper -> mapper.using(messageContentConverter)
                                .map(ChatMessage::getContent, ChatMessageDto::setContent)
                )
                .addMappings(
                        mapper -> mapper.using(userConverter)
                                .map(ChatMessage::getOwner, ChatMessageDto::setOwner)

                )
                .addMappings(
                        mapper -> mapper.using(instantToStringConverter)
                                .map(ChatMessage::getLastEditDate, ChatMessageDto::setLastEditDate)
                );

    }
}
