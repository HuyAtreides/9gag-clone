package com.huyphan.mappers;

import com.huyphan.dtos.ChatConversationDto;
import com.huyphan.dtos.ConversationReadStatusDto;
import com.huyphan.dtos.UserDto;
import com.huyphan.models.ChatConversation;
import com.huyphan.models.ConversationReadStatus;
import com.huyphan.models.User;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.modelmapper.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ConversationMapper extends BaseMapper implements
        ToDtoMapper<ChatConversationDto, ChatConversation> {

    @Autowired
    private Converter<Instant, String> instantToStringConverter;

    @Override
    public ChatConversationDto toDto(ChatConversation data) {
        return modelMapper.map(data, ChatConversationDto.class);
    }

    @Override
    public void createTypeMap() {
        Converter<Set<User>, List<UserDto>> usersConverter = mappingContext -> {
            Set<User> users = mappingContext.getSource();

            return users.stream().map(user -> modelMapper.map(user, UserDto.class))
                    .collect(Collectors.toList());
        };

        Converter<Set<ConversationReadStatus>, List<ConversationReadStatusDto>> readStatusesConverter
                = mappingContext -> {
            Set<ConversationReadStatus> statuses = mappingContext.getSource();

            return statuses.stream()
                    .map(status -> modelMapper.map(status, ConversationReadStatusDto.class))
                    .collect(Collectors.toList());
        };

        modelMapper.createTypeMap(ChatConversation.class, ChatConversationDto.class)
                .addMappings(
                        mapper -> mapper.using(usersConverter
                        ).map(ChatConversation::getParticipants,
                                ChatConversationDto::setParticipants)

                )
                .addMappings(
                        mapper -> mapper.using(instantToStringConverter)
                                .map(ChatConversation::getCreated, ChatConversationDto::setCreated)
                )
                .addMappings(
                        mapper -> mapper.using(readStatusesConverter
                        ).map(ChatConversation::getReadStatuses,
                                ChatConversationDto::setReadStatuses)

                );
    }
}
