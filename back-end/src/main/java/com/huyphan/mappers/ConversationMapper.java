package com.huyphan.mappers;

import com.huyphan.dtos.ChatConversationDto;
import com.huyphan.dtos.ChatMessageDto;
import com.huyphan.dtos.UserDto;
import com.huyphan.models.ChatConversation;
import com.huyphan.models.ChatMessage;
import com.huyphan.models.ChatParticipant;
import com.huyphan.models.User;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.modelmapper.Converter;
import org.springframework.stereotype.Component;

@Component
public class ConversationMapper extends BaseMapper implements ToDtoMapper<ChatConversationDto, ChatConversation> {

    @Override
    public ChatConversationDto toDto(ChatConversation data) {
        return modelMapper.map(data, ChatConversationDto.class);
    }

    @Override
    public void createTypeMap() {
        Converter<Set<User>, List<UserDto>> converter = mappingContext -> {
            Set<User> users = mappingContext.getSource();

            return users.stream().map(user -> modelMapper.map(user, UserDto.class))
                    .collect(Collectors.toList());
        };

        modelMapper.createTypeMap(ChatConversation.class, ChatConversationDto.class)
                .addMappings(
                        mapper -> mapper.using(converter
                        ).map(ChatConversation::getParticipants,
                                ChatConversationDto::setParticipants)

                );
    }
}
