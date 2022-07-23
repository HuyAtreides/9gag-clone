package com.huyphan.controllers.converters;

import com.huyphan.models.enums.PostTag;
import com.huyphan.models.exceptions.ValueToEnumException;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToPostTagConverter implements Converter<String, PostTag> {

    @Override
    public PostTag convert(String source) {
        try {
            return PostTag.toPostTag(source);
        } catch (ValueToEnumException e) {
            e.printStackTrace();
            return null;
        }
    }
}
