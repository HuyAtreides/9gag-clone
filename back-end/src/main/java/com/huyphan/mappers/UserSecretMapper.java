package com.huyphan.mappers;

import com.huyphan.dtos.UserSecretDto;
import com.huyphan.models.UserSecret;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * Map user secret.
 */
@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class UserSecretMapper extends BaseMapper implements ToDtoMapper<UserSecretDto, UserSecret>,
        FromDtoMapper<UserSecretDto, UserSecret> {

    @Override
    public void createTypeMap() {
        getModelMapper().typeMap(UserSecret.class, UserSecretDto.class);
        getModelMapper().typeMap(UserSecretDto.class, UserSecret.class);
    }

    @Override
    public UserSecretDto toDto(UserSecret data) {
        return getModelMapper().map(data, UserSecretDto.class);
    }

    @Override
    public UserSecret fromDto(UserSecretDto data) {
        return getModelMapper().map(data, UserSecret.class);
    }
}
