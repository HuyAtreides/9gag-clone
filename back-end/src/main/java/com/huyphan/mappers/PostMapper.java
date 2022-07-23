package com.huyphan.mappers;

import com.huyphan.dtos.PostDto;
import com.huyphan.models.Post;
import java.time.Instant;
import org.modelmapper.Converter;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class PostMapper extends BaseMapper implements ToDtoMapper<PostDto, Post>,
        FromDtoMapper<PostDto, Post> {

    @Override
    public void createTypeMap() {
        Converter<Instant, String> instantToStringConverter = (context) -> {
            Instant instant = context.getSource();
            return instant.toString();
        };

        Converter<String, Instant> stringToInstantConverter = (context) -> {
            String dateTime = context.getSource();
            return Instant.parse(dateTime);
        };

        getModelMapper().typeMap(Post.class, PostDto.class).addMappings(
                (mapper) -> mapper.using(instantToStringConverter)
                        .map(Post::getUploadTime, PostDto::setUploadTime)
        );

        getModelMapper().typeMap(PostDto.class, Post.class).addMappings(
                (mapper) -> mapper.using(stringToInstantConverter)
                        .map(PostDto::getUploadTime, Post::setUploadTime)
        );
    }

    @Override
    public PostDto toDto(Post data) {
        return getModelMapper().map(data, PostDto.class);
    }

    @Override
    public Post fromDto(PostDto data) {
        return getModelMapper().map(data, Post.class);
    }
}
