package com.huyphan.mappers;

import com.huyphan.dtos.SliceDto;
import java.util.List;
import java.util.stream.Collectors;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Component;

@Component
public class SliceMapper<TDto, TDomain> {

    @Autowired
    private ModelMapper modelMapper;

    public SliceDto<TDto> toDto(Slice<TDomain> data, ToDtoMapper<TDto, TDomain> toDtoMapper) {
        Class<SliceDto<TDto>> desType = new TypeToken<SliceDto<TDto>>() {
        }.getRawType();
        Converter<List<TDomain>, List<TDto>> converter = (context) -> {
            List<TDomain> domainList = context.getSource();

            return domainList.stream().map(toDtoMapper::toDto).collect(Collectors.toList());
        };
        modelMapper.createTypeMap(data.getClass(), desType).addMappings(
                mapper -> mapper.using(converter)
                        .map(Slice<TDomain>::getContent, SliceDto<TDto>::setContent)
        );

        return modelMapper.map(data, desType);
    }
}