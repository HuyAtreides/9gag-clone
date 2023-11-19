package com.huyphan.mappers.converters;

import com.huyphan.utils.AWSS3Util;
import java.time.Instant;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class S3URLToCloudFrontURLConverter implements Converter<String, String> {

    @Autowired
    private AWSS3Util awss3Util;

    @Override
    public String convert(MappingContext<String, String> context) {
        String url = context.getSource();

        return awss3Util.convertS3URLToCloudFrontURL(url);
    }
}
