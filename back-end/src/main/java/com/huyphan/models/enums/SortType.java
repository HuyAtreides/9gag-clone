package com.huyphan.models.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import com.huyphan.models.exceptions.ValueToEnumException;
import java.util.Arrays;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum SortType {
    FRESH("fresh"),
    TOP("top"),
    USER_FAV_SECTIONS("userFavSections");

    private final String value;

    /**
     * Converts string value to Country object.
     *
     * @throws ValueToEnumException If the country doesn't exist.
     */
    static public SortType toSortType(String value) throws ValueToEnumException {
        return Arrays.stream(SortType.values()).filter(c -> c.getValue().equals(value)).findFirst()
                .orElseThrow(() -> new ValueToEnumException("Post tag doesn't exist."));
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
