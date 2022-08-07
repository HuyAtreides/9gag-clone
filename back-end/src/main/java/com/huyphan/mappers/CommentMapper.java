package com.huyphan.mappers;

import com.huyphan.dtos.CommentDto;
import com.huyphan.models.Comment;
import java.time.Instant;
import org.modelmapper.Converter;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class CommentMapper extends BaseMapper implements ToDtoMapper<CommentDto, Comment>,
        FromDtoMapper<CommentDto, Comment> {

    @Override
    public void createTypeMap() {
        Converter<Instant, String> instantToStringConverter = (context) -> {
            Instant instant = context.getSource();
            return instant.toString();
        };

        Converter<Comment, CommentDto> replyToReplyDtoConverter = (context) -> {
            Comment reply = context.getSource();
            if (reply != null) {
                reply.setReplyTo(null);
                return modelMapper.map(reply, CommentDto.class);
            }
            return null;
        };

        modelMapper.typeMap(Comment.class, CommentDto.class)
                .addMappings(
                        mapper -> mapper.using(instantToStringConverter)
                                .map(Comment::getDate, CommentDto::setDate))
                .addMappings(
                        mapper -> mapper.using(replyToReplyDtoConverter)
                                .map(Comment::getReplyTo, CommentDto::setReplyTo));

        Converter<String, Instant> stringToInstantConverter = (context) -> {
            String dateTime = context.getSource();
            return Instant.parse(dateTime);
        };

        modelMapper.typeMap(CommentDto.class, Comment.class).addMappings(
                mapper -> mapper.using(stringToInstantConverter)
                        .map(CommentDto::getDate, Comment::setDate)
        );
    }

    @Override
    public Comment fromDto(CommentDto data) {
        return modelMapper.map(data, Comment.class);
    }

    @Override
    public CommentDto toDto(Comment data) {
        return modelMapper.map(data, CommentDto.class);
    }
}
