package com.huyphan.mappers;

import com.huyphan.dtos.PageDto;
import java.lang.reflect.Type;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class PageMapper<TDto, TDomain> implements
        ToDtoMapper<PageDto<TDto>, Page<TDomain>> {

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public PageDto<TDto> toDto(Page<TDomain> data) {
        Type sourceType = new TypeToken<Page<TDomain>>() {
        }.getType();
        Type desType = new TypeToken<PageDto<TDto>>() {
        }.getType();
        final String TYPE_MAP_NAME = "PageTypeMap";
        modelMapper.createTypeMap(sourceType.getClass(), desType.getClass(), TYPE_MAP_NAME);
        return modelMapper.map(data, desType, TYPE_MAP_NAME);
    }
}
