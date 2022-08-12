package com.huyphan.mappers.converters;

import java.time.Instant;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;
import org.springframework.stereotype.Component;

@Component
public class InstantToStringConverter implements Converter<Instant, String> {

    @Override
    public String convert(MappingContext<Instant, String> mappingContext) {
        Instant instant = mappingContext.getSource();
        return instant.toString();
    }
}
