package com.huyphan.models.converters;

import com.huyphan.models.Post;
import com.huyphan.models.enums.PostContentType;
import com.huyphan.models.exceptions.ValueToEnumException;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class PostContentTypeConverter implements AttributeConverter<PostContentType, String> {

    @Override
    public String convertToDatabaseColumn(PostContentType postContentType) {
        return postContentType.getValue();
    }

    @Override
    public PostContentType convertToEntityAttribute(String s) {
        try {
            return PostContentType.toPostContentType(s);
        } catch (ValueToEnumException ex) {
            ex.printStackTrace();
            return null;
        }
    }
}
