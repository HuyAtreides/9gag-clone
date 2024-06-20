package com.huyphan.mappers;

import com.huyphan.dtos.ReportUserRequestDto;
import com.huyphan.dtos.SectionDto;
import com.huyphan.models.ReportUserRequest;
import com.huyphan.models.Section;
import org.springframework.stereotype.Component;

@Component
public class ReportUserRequestMapper extends BaseMapper implements FromDtoMapper<ReportUserRequestDto, ReportUserRequest>{

    @Override
    public void createTypeMap() {
        modelMapper.typeMap(ReportUserRequestDto.class, ReportUserRequest.class);
    }

    @Override
    public ReportUserRequest fromDto(ReportUserRequestDto data) {
        return modelMapper.map(data, ReportUserRequest.class);
    }
}
