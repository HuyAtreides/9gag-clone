package com.huyphan.mappers;

import com.huyphan.dtos.SectionDto;
import com.huyphan.dtos.SocialLoginDataDto;
import com.huyphan.models.Section;
import com.huyphan.models.SocialLoginData;
import org.springframework.stereotype.Component;

@Component
public class SocialLoginDataMapper extends BaseMapper implements
        FromDtoMapper<SocialLoginDataDto, SocialLoginData> {

    @Override
    public void createTypeMap() {
        modelMapper.typeMap(SocialLoginDataDto.class, SocialLoginData.class);
    }

    @Override
    public SocialLoginData fromDto(SocialLoginDataDto data) {
        return modelMapper.map(data, SocialLoginData.class);
    }
}
