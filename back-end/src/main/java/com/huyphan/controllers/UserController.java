package com.huyphan.controllers;

import com.huyphan.dtos.UserDto;
import com.huyphan.mappers.UserMapper;
import com.huyphan.models.User;
import com.huyphan.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @GetMapping
    public UserDto getUser() {
        User user = userService.getUser();
        return userMapper.toDto(user);
    }
}
