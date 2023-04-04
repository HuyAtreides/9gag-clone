package com.huyphan.mappers;

import com.huyphan.dtos.CommentDto;
import com.huyphan.dtos.UserDto;
import com.huyphan.models.Comment;
import com.huyphan.models.Post;
import java.time.Instant;
import org.modelmapper.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class CommentMapper extends BaseMapper implements ToDtoMapper<CommentDto, Comment>,
        FromDtoMapper<CommentDto, Comment> {

    @Autowired
    private Converter<Instant, String> instantToStringConverter;

    @Autowired
    private Converter<String, Instant> stringToInstantConverter;

    @Override
    public void createTypeMap() {
        Converter<Comment, UserDto> replyToReplyDtoConverter = (context) -> {
            Comment reply = context.getSource();

            return reply == null ? null : modelMapper.map(reply.getUser(), UserDto.class);
        };

        Converter<Comment, Long> commentToIdConverter = (context) -> {
            Comment comment = context.getSource();

            return comment != null ? comment.getId() : null;
        };

        Converter<Post, Long> postToIdConverter = (context) -> {
            Post post = context.getSource();

            return post.getId();
        };

        modelMapper.typeMap(Comment.class, CommentDto.class)
                .addMappings(
                        mapper -> mapper.using(instantToStringConverter)
                                .map(Comment::getDate, CommentDto::setDate))
                .addMappings(
                        mapper -> mapper.using(replyToReplyDtoConverter)
                                .map(Comment::getReplyTo, CommentDto::setReplyTo))
                .addMappings(
                        mapper -> mapper.using(commentToIdConverter)
                                .map(Comment::getParent, CommentDto::setParentId))
                .addMappings(
                        mapper -> mapper.using(commentToIdConverter)
                                .map(Comment::getReplyTo, CommentDto::setReplyToId))
                .addMappings(
                        mapper -> mapper.using(postToIdConverter)
                                .map(Comment::getPost, CommentDto::setPostId));

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
