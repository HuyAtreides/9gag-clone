package com.huyphan.mappers;

import com.huyphan.dtos.CommentPageOptionsDto;
import com.huyphan.models.CommentPageOptions;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class CommentPageOptionsMapper extends BaseMapper implements
        FromDtoMapper<CommentPageOptionsDto, CommentPageOptions> {

    @Override
    public void createTypeMap() {
        modelMapper.createTypeMap(CommentPageOptionsDto.class, CommentPageOptions.class);
    }

    @Override
    public CommentPageOptions fromDto(CommentPageOptionsDto data) {
        return modelMapper.map(data, CommentPageOptions.class);
    }
}
