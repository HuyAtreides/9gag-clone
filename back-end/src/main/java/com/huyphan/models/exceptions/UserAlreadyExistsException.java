package com.huyphan.models.exceptions;

/**
 * User already exists exception
 */
public class UserAlreadyExistsException extends AppException {

    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
