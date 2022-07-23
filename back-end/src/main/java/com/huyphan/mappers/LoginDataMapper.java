package com.huyphan.mappers;

import com.huyphan.dtos.LoginDataDto;
import com.huyphan.models.LoginData;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * Map login data.
 */
@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class LoginDataMapper extends BaseMapper implements FromDtoMapper<LoginDataDto, LoginData> {

    @Override
    public void createTypeMap() {
        getModelMapper().typeMap(LoginDataDto.class, LoginData.class);
    }

    @Override
    public LoginData fromDto(LoginDataDto data) {
        return getModelMapper().map(data, LoginData.class);
    }

}
