package com.huyphan.mappers;

import com.huyphan.dtos.CommentDto;
import com.huyphan.dtos.FollowRequestDto;
import com.huyphan.models.Comment;
import com.huyphan.models.FollowRequest;
import java.time.Instant;
import org.modelmapper.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class FollowRequestMapper extends BaseMapper implements
        ToDtoMapper<FollowRequestDto, FollowRequest> {

    @Autowired
    private Converter<Instant, String> instantToStringConverter;

    @Override
    public void createTypeMap() {
        modelMapper.createTypeMap(FollowRequest.class, FollowRequestDto.class).addMappings(
                mapper -> mapper.using(instantToStringConverter)
                        .map(FollowRequest::getCreated, FollowRequestDto::setCreated));
    }

    @Override
    public FollowRequestDto toDto(FollowRequest data) {
        return modelMapper.map(data, FollowRequestDto.class);
    }
}
