package com.huyphan.controllers.converters;

import com.huyphan.models.enums.SortType;
import com.huyphan.models.exceptions.ValueToEnumException;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToPostTagConverter implements Converter<String, SortType> {

    @Override
    public SortType convert(String source) {
        try {
            return SortType.toSortType(source);
        } catch (ValueToEnumException e) {
            e.printStackTrace();
            return null;
        }
    }
}
