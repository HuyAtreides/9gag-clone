package com.huyphan.mappers;

import com.huyphan.dtos.ReportDto;
import com.huyphan.models.Report;
import java.time.Instant;
import org.modelmapper.Converter;
import org.springframework.beans.factory.annotation.Autowired;

public class ReportMapper extends BaseMapper implements ToDtoMapper<ReportDto, Report> {


    @Autowired
    private Converter<Instant, String> instantToStringConverter;

    @Override
    public void createTypeMap() {
        modelMapper.createTypeMap(Report.class, ReportDto.class).addMappings(
                mapper -> mapper.using(instantToStringConverter).map(
                        Report::getCreatedAt,
                        ReportDto::setCreatedAt
                )
        );
    }

    @Override
    public ReportDto toDto(Report data) {
        return modelMapper.map(data, ReportDto.class);
    }
}
