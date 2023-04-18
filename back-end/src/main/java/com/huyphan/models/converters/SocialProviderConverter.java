package com.huyphan.models.converters;

import com.huyphan.models.enums.NotificationType;
import com.huyphan.models.enums.SocialProvider;
import com.huyphan.models.exceptions.ValueToEnumException;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class SocialProviderConverter implements AttributeConverter<SocialProvider, String> {

    @Override
    public String convertToDatabaseColumn(SocialProvider socialProvider) {
        return socialProvider.getValue();
    }

    @Override
    public SocialProvider convertToEntityAttribute(String dbData) {
        try {
            return SocialProvider.toProvider(dbData);
        } catch (ValueToEnumException e) {
            e.printStackTrace();
            return null;
        }
    }
}
