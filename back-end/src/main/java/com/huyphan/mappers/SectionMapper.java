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
public class SectionMapper extends BaseMapper implements ToDtoMapper<SectionDto, Section> {

    @Override
    public SectionDto toDto(Section data) {
        return modelMapper.map(data, SectionDto.class);
    }

    @Override
    public void createTypeMap() {
        modelMapper.typeMap(Section.class, SectionDto.class);
    }
}
