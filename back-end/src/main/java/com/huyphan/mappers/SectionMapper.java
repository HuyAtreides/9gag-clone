package com.huyphan.mappers;

import com.huyphan.dtos.SectionDto;
import com.huyphan.models.Section;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * Section mapper
 */
@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class SectionMapper extends BaseMapper {

    @Override
    public void createTypeMap() {
        getModelMapper().typeMap(Section.class, SectionDto.class);
    }
}
