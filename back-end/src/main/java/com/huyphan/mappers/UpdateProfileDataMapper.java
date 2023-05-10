package com.huyphan.mappers;

import com.huyphan.dtos.UpdateProfileDataDto;
import com.huyphan.models.UpdateProfileData;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class UpdateProfileDataMapper extends BaseMapper implements
        FromDtoMapper<UpdateProfileDataDto, UpdateProfileData> {

    @Override
    public void createTypeMap() {
        modelMapper.createTypeMap(UpdateProfileDataDto.class, UpdateProfileData.class);
    }

    @Override
    public UpdateProfileData fromDto(UpdateProfileDataDto data) {
        return modelMapper.map(data, UpdateProfileData.class);
    }
}
