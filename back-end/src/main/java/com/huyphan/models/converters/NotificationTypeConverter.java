package com.huyphan.models.converters;

import com.huyphan.models.enums.NotificationType;
import com.huyphan.models.exceptions.ValueToEnumException;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class NotificationTypeConverter implements AttributeConverter<NotificationType, String> {

    @Override
    public String convertToDatabaseColumn(NotificationType attribute) {
        return attribute.getValue();
    }

    @Override
    public NotificationType convertToEntityAttribute(String dbData) {
        try {
            return NotificationType.toNotificationType(dbData);
        } catch (ValueToEnumException e) {
            e.printStackTrace();
            return null;
        }
    }
}
