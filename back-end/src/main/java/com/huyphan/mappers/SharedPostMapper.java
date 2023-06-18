package com.huyphan.mappers;

import com.huyphan.dtos.SectionDto;
import com.huyphan.dtos.SharedPostDto;
import com.huyphan.models.Section;
import com.huyphan.models.SharedPost;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class SharedPostMapper extends BaseMapper implements ToDtoMapper<SharedPostDto, SharedPost> {

    @Override
    public SharedPostDto toDto(SharedPost data) {
        return modelMapper.map(data, SharedPostDto.class);
    }

    @Override
    public void createTypeMap() {
        modelMapper.typeMap(SharedPost.class, SharedPostDto.class).addMappings(
                mapper -> mapper.when(context -> ((SharedPost) context.getSource()).isAnonymous())
                        .skip(SharedPost::getOriginalPoster, SharedPostDto::setOriginalPoster)
        );
    }
}