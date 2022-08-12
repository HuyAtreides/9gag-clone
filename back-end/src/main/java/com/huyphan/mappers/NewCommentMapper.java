package com.huyphan.mappers;

import com.huyphan.dtos.NewCommentDto;
import com.huyphan.models.NewComment;
import java.time.Instant;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NewCommentMapper implements FromDtoMapper<NewCommentDto, NewComment> {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private Converter<String, Instant> stringToInstantConverter;

    @Override
    public NewComment fromDto(NewCommentDto data) {
        modelMapper.typeMap(NewCommentDto.class, NewComment.class).addMappings(
                (mapper) -> mapper.using(stringToInstantConverter)
                        .map(NewCommentDto::getDate, NewComment::setDate)
        );

        return modelMapper.map(data, NewComment.class);
    }
}
