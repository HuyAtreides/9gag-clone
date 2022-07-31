package com.huyphan.controllers;

import com.huyphan.dtos.UserDto;
import com.huyphan.mappers.UserMapper;
import com.huyphan.models.User;
import com.huyphan.models.exceptions.UserException;
import com.huyphan.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    /**
     * Get current authenticated user profile.
     */
    @GetMapping
    public UserDto getUser() {
        User user = userService.getUser();
        return userMapper.toDto(user);
    }

    @GetMapping("{id}")
    public UserDto getUserById(@PathVariable Long id) throws UserException {
        User user = userService.getUserById(id);
        return userMapper.toDto(user);
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public UserException handleExceptions(UserException exception) {
        return exception;
    }
}
