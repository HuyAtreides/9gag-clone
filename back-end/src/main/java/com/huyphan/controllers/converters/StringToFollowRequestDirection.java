package com.huyphan.controllers.converters;

import com.huyphan.models.enums.FollowRequestDirection;
import com.huyphan.models.enums.FollowRequestStatus;
import com.huyphan.models.exceptions.ValueToEnumException;
import java.util.Arrays;
import java.util.Objects;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToFollowRequestDirection implements Converter<String, FollowRequestDirection> {

    @Override
    public FollowRequestDirection convert(String source) {
        try {
            return Arrays.stream(FollowRequestDirection.values()).filter(followRequestStatus ->
                    Objects.equals(followRequestStatus.getValue(), source)
            ).findFirst().orElseThrow(() -> new ValueToEnumException("Status not found"));
        } catch (ValueToEnumException e) {
            e.printStackTrace();
            return null;
        }
    }
}