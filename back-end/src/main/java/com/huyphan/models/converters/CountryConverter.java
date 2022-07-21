package com.huyphan.models.converters;

import com.huyphan.models.enums.Country;
import com.huyphan.models.exceptions.ValueToEnumException;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class CountryConverter implements AttributeConverter<Country, String> {

    @Override
    public String convertToDatabaseColumn(Country attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public Country convertToEntityAttribute(String dbData) {
        try {
            return dbData == null ? null : Country.toCountry(dbData);
        } catch (ValueToEnumException e) {
            e.printStackTrace();
            return null;
        }
    }
}
