package com.huyphan.models.exceptions;

/**
 * Cannot convert a value to enum exception.
 */
public class ValueToEnumException extends AppException {

    public ValueToEnumException(String message) {
        super(message);
    }
}
