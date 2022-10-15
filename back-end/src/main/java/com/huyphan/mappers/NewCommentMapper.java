package com.huyphan.mappers;

import com.huyphan.dtos.NewCommentDto;
import com.huyphan.models.NewComment;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NewCommentMapper implements FromDtoMapper<NewCommentDto, NewComment> {

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public NewComment fromDto(NewCommentDto data) {
        return modelMapper.map(data, NewComment.class);
    }
}
