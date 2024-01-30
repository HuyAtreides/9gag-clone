package com.huyphan.mappers;

import com.huyphan.dtos.ConversationReadStatusDto;
import com.huyphan.dtos.UserDto;
import com.huyphan.models.ChatParticipant;
import com.huyphan.models.ConversationReadStatus;
import com.huyphan.models.User;
import java.time.Instant;
import org.modelmapper.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ConversationReadStatusMapper extends BaseMapper implements
        ToDtoMapper<ConversationReadStatusDto, ConversationReadStatus> {

    @Autowired
    private Converter<Instant, String> instantToStringConverter;

    @Override
    public void createTypeMap() {
        Converter<ChatParticipant, UserDto> chatParticipantConverter = (context) -> {
            User user = (User) context.getSource();

            return modelMapper.map(user, UserDto.class);
        };

        modelMapper.createTypeMap(ConversationReadStatus.class, ConversationReadStatusDto.class)
                .addMappings(
                        (mapper) -> mapper.using(instantToStringConverter)
                                .map(ConversationReadStatus::getReadAt,
                                        ConversationReadStatusDto::setReadAt)
                )
                .addMappings(
                        (mapper) -> mapper.using(chatParticipantConverter)
                                .map(ConversationReadStatus::getReadBy,
                                        ConversationReadStatusDto::setReadBy)
                );
    }

    @Override
    public ConversationReadStatusDto toDto(ConversationReadStatus data) {
        return modelMapper.map(data, ConversationReadStatusDto.class);
    }
}
