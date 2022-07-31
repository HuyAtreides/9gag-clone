package com.huyphan.mappers;

import com.huyphan.dtos.UserDto;
import com.huyphan.models.User;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * User mapper.
 */
@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class UserMapper extends BaseMapper implements ToDtoMapper<UserDto, User> {

    @Override
    public UserDto toDto(User data) {
        return modelMapper.map(data, UserDto.class);
    }

    @Override
    public void createTypeMap() {
        modelMapper.typeMap(User.class, UserDto.class);
    }
}