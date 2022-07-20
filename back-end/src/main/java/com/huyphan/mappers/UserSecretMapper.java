package com.huyphan.mappers;

import com.huyphan.dtos.UserSecretDto;
import com.huyphan.models.UserSecret;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Map user secret.
 */
@Component
public class UserSecretMapper implements ToDtoMapper<UserSecretDto, UserSecret> {

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public UserSecretDto toDto(UserSecret data) {
        return modelMapper.map(data, UserSecretDto.class);
    }
}
