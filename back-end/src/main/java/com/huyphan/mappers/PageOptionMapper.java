package com.huyphan.mappers;

import com.huyphan.dtos.PageOptionsDto;
import com.huyphan.models.PageOptions;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class PageOptionMapper extends BaseMapper implements
        FromDtoMapper<PageOptionsDto, PageOptions> {

    @Override
    public void createTypeMap() {
        modelMapper.typeMap(PageOptionsDto.class, PageOptions.class);
    }

    @Override
    public PageOptions fromDto(PageOptionsDto data) {
        return modelMapper.map(data, PageOptions.class);
    }
}
