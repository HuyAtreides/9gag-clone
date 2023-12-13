package com.huyphan.mappers;

import com.huyphan.dtos.NewChatMessageDataDto;
import com.huyphan.mappers.converters.StringToInstantConverter;
import com.huyphan.models.NewChatMessageData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class NewChatMessageDataMapper extends BaseMapper implements
        FromDtoMapper<NewChatMessageDataDto, NewChatMessageData> {

    @Autowired
    private StringToInstantConverter converter;

    @Override
    public NewChatMessageData fromDto(NewChatMessageDataDto data) {
        return modelMapper.map(data, NewChatMessageData.class);
    }

    @Override
    public void createTypeMap() {
        modelMapper.createTypeMap(NewChatMessageDataDto.class, NewChatMessageData.class)
                .addMappings(
                        mapper -> mapper.using(converter)
                                .map(NewChatMessageDataDto::getSentDate,
                                        NewChatMessageData::setSentDate)
                );
    }
}
