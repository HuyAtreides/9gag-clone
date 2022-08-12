package com.huyphan.mappers;

import com.huyphan.dtos.MediaLocationDto;
import com.huyphan.models.MediaLocation;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MediaLocationMapper implements ToDtoMapper<MediaLocationDto, MediaLocation> {

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public MediaLocationDto toDto(MediaLocation data) {
        return modelMapper.map(data, MediaLocationDto.class);
    }
}
