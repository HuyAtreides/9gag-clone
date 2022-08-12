package com.huyphan.mappers.converters;

import java.time.Instant;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;
import org.springframework.stereotype.Component;

@Component
public class StringToInstantConverter implements Converter<String, Instant> {

    @Override
    public Instant convert(MappingContext<String, Instant> mappingContext) {
        String dateTime = mappingContext.getSource();
        return Instant.parse(dateTime);
    }
}
