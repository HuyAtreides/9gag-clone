package com.huyphan.mappers;

import com.huyphan.dtos.UpdatePasswordDataDto;
import com.huyphan.models.UpdatePasswordData;
import com.huyphan.models.UpdateProfileData;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class UpdatePasswordDataMapper extends BaseMapper implements
        FromDtoMapper<UpdatePasswordDataDto, UpdatePasswordData> {

    @Override
    public void createTypeMap() {
        modelMapper.createTypeMap(UpdatePasswordDataDto.class, UpdatePasswordData.class);
    }

    @Override
    public UpdatePasswordData fromDto(UpdatePasswordDataDto data) {
        return modelMapper.map(data, UpdatePasswordData.class);
    }
}
