package com.huyphan.mappers;

import com.huyphan.dtos.LoginDataDto;
import com.huyphan.models.LoginData;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Map login data.
 */
@Component
public class LoginDataMapper implements FromDtoMapper<LoginDataDto, LoginData> {

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public LoginData fromDto(LoginDataDto data) {
        return modelMapper.map(data, LoginData.class);
    }
}
