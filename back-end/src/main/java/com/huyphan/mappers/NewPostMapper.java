package com.huyphan.mappers;

import com.huyphan.dtos.NewPostDto;
import com.huyphan.models.NewPost;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NewPostMapper implements FromDtoMapper<NewPostDto, NewPost> {

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public NewPost fromDto(NewPostDto data) {
        return modelMapper.map(data, NewPost.class);
    }
}
