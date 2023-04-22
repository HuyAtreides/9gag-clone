package com.huyphan.models.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import com.huyphan.models.exceptions.ValueToEnumException;
import java.util.Arrays;

public enum SocialProvider {
    GOOGLE("GOOGLE"),
    FACEBOOK("FACEBOOK");

    private final String value;

    SocialProvider(String value) {
        this.value = value;
    }

    static public SocialProvider toProvider(String value) throws ValueToEnumException {
        if (value == null) {
            return null;
        }

        return Arrays.stream(SocialProvider.values()).filter(c -> c.getValue().equals(value))
                .findFirst()
                .orElseThrow(() -> new ValueToEnumException("Social provider doesn't exist."));
    }

    @JsonValue
    public String getValue() {
        return value;
    }

}
