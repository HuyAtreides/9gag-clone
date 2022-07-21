package com.huyphan.mappers;

import com.huyphan.dtos.SectionDto;
import com.huyphan.models.Section;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Section mapper
 */
@Component
public class SectionMapper implements ToDtoMapper<SectionDto, Section> {

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public SectionDto toDto(Section data) {
        return modelMapper.map(data, SectionDto.class);
    }
}
