package com.huyphan.controllers.converters;

import com.huyphan.models.enums.FollowRequestStatus;
import com.huyphan.models.exceptions.ValueToEnumException;
import java.util.Arrays;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToFollowRequestStatusConverter implements Converter<String, FollowRequestStatus> {

    @Override
    public FollowRequestStatus convert(String source) {
        try {
            return Arrays.stream(FollowRequestStatus.values()).filter(followRequestStatus ->
                    followRequestStatus.ordinal() == Integer.parseInt(source)
                    ).findFirst().orElseThrow(() -> new ValueToEnumException("Status not found"));
        } catch (ValueToEnumException e) {
            e.printStackTrace();
            return null;
        }
    }
}


