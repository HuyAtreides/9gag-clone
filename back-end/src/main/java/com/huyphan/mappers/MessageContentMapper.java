package com.huyphan.mappers;

import com.huyphan.dtos.MessageContentDto;
import com.huyphan.dtos.PostDto;
import com.huyphan.models.MessageContent;
import com.huyphan.models.Post;
import java.time.Instant;
import org.aspectj.bridge.Message;
import org.modelmapper.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MessageContentMapper extends BaseMapper implements FromDtoMapper<MessageContentDto, MessageContent>,
        ToDtoMapper<MessageContentDto, MessageContent>{

    @Autowired
    private Converter<Instant, String> instantToStringConverter;

    @Autowired
    private Converter<String, Instant> stringToInstantConverter;

    @Override
    public void createTypeMap() {
        modelMapper.typeMap(MessageContent.class, MessageContentDto.class);
        modelMapper.typeMap(MessageContentDto.class, MessageContent.class);
    }

    @Override
    public MessageContent fromDto(MessageContentDto data) {
        return modelMapper.map(data, MessageContent.class);
    }

    @Override
    public MessageContentDto toDto(MessageContent data) {
        return modelMapper.map(data, MessageContentDto.class);
    }
}
