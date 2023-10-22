package com.huyphan.models.converters;

import com.huyphan.models.enums.SocialProvider;
import com.huyphan.models.enums.SupportedMIMEType;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class SupportedMIMETypeConverter implements AttributeConverter<SupportedMIMEType, String> {

    @Override
    public String convertToDatabaseColumn(SupportedMIMEType supportedMIMEType) {
        return supportedMIMEType == null ? null : supportedMIMEType.getValue();
    }

    @Override
    public SupportedMIMEType convertToEntityAttribute(String s) {
        return s == null ? null : SupportedMIMEType.toSupportedMIMEType(s);
    }
}
