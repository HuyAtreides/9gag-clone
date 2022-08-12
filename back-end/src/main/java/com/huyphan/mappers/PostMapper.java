package com.huyphan.mappers;

import com.huyphan.dtos.PostDto;
import com.huyphan.models.Post;
import java.time.Instant;
import org.modelmapper.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class PostMapper extends BaseMapper implements ToDtoMapper<PostDto, Post>,
        FromDtoMapper<PostDto, Post> {

    @Autowired
    private Converter<String, Instant> stringToInstantConverter;

    @Autowired
    private Converter<Instant, String> instantToStringConverter;

    @Override
    public void createTypeMap() {
        modelMapper.typeMap(Post.class, PostDto.class).addMappings(
                (mapper) -> mapper.using(instantToStringConverter)
                        .map(Post::getUploadTime, PostDto::setUploadTime)
        );

        modelMapper.typeMap(PostDto.class, Post.class).addMappings(
                (mapper) -> mapper.using(stringToInstantConverter)
                        .map(PostDto::getUploadTime, Post::setUploadTime)
        );
    }

    @Override
    public PostDto toDto(Post data) {
        return modelMapper.map(data, PostDto.class);
    }

    @Override
    public Post fromDto(PostDto data) {
        return modelMapper.map(data, Post.class);
    }
}
