package com.huyphan.mappers;

import com.huyphan.dtos.RegisterDataDto;
import com.huyphan.models.RegisterData;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Map register data.
 */
@Component
public class RegisterDataMapper implements FromDtoMapper<RegisterDataDto, RegisterData> {

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RegisterData fromDto(RegisterDataDto data) {
        return modelMapper.map(data, RegisterData.class);
    }
}
