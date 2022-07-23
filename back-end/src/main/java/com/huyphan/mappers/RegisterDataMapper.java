package com.huyphan.mappers;

import com.huyphan.dtos.RegisterDataDto;
import com.huyphan.models.RegisterData;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * Map register data.
 */
@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class RegisterDataMapper extends BaseMapper implements
        FromDtoMapper<RegisterDataDto, RegisterData> {

    @Override
    public void createTypeMap() {
        getModelMapper().typeMap(RegisterDataDto.class, RegisterData.class);
    }

    @Override
    public RegisterData fromDto(RegisterDataDto data) {
        return getModelMapper().map(data, RegisterData.class);
    }
}
