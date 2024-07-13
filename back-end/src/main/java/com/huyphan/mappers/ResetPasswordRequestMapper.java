package com.huyphan.mappers;

import com.huyphan.dtos.ReportUserRequestDto;
import com.huyphan.dtos.ResetPasswordRequestDto;
import com.huyphan.models.ReportUserRequest;
import com.huyphan.models.ResetPasswordRequest;
import org.springframework.stereotype.Component;

@Component
public class ResetPasswordRequestMapper extends BaseMapper implements FromDtoMapper<ResetPasswordRequestDto, ResetPasswordRequest>{

    @Override
    public void createTypeMap() {
        modelMapper.typeMap(ReportUserRequestDto.class, ResetPasswordRequest.class);
    }

    @Override
    public ResetPasswordRequest fromDto(ResetPasswordRequestDto data) {
        return modelMapper.map(data, ResetPasswordRequest.class);
    }
}
