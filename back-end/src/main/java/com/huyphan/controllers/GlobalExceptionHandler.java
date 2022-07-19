package com.huyphan.controllers;

import com.huyphan.models.exceptions.AppException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Handle exceptions for the whole application.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public Exception handleApplicationException(Exception exception) {
        return new AppException("Something wrong happened, please try again latter");
    }

}
