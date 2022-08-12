package com.huyphan.mappers;

import com.huyphan.dtos.NewPostDto;
import com.huyphan.models.NewPost;
import java.time.Instant;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NewPostMapper implements FromDtoMapper<NewPostDto, NewPost> {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private Converter<String, Instant> stringToInstantConverter;


    @Override
    public NewPost fromDto(NewPostDto data) {
        modelMapper.typeMap(NewPostDto.class, NewPost.class).addMappings(
                (mapper) -> mapper.using(stringToInstantConverter)
                        .map(NewPostDto::getUploadTime, NewPost::setUploadTime)
        );

        return modelMapper.map(data, NewPost.class);
    }
}
