package com.huyphan.models.enums;

import com.huyphan.models.exceptions.ValueToEnumException;
import java.util.Arrays;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum PostTag {
    FRESH("fresh"),
    TOP("top");

    private final String value;

    /**
     * Converts string value to Country object.
     *
     * @throws ValueToEnumException If the country doesn't exist.
     */
    static public PostTag toPostTag(String value) throws ValueToEnumException {
        return Arrays.stream(PostTag.values()).filter(c -> c.getValue().equals(value)).findFirst()
                .orElseThrow(() -> new ValueToEnumException("Post tag doesn't exist."));
    }
}
