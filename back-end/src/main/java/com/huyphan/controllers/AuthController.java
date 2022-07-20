package com.huyphan.controllers;

import com.huyphan.dtos.LoginDataDto;
import com.huyphan.dtos.UserSecretDto;
import com.huyphan.mappers.LoginDataMapper;
import com.huyphan.mappers.UserSecretMapper;
import com.huyphan.models.LoginData;
import com.huyphan.models.UserSecret;
import com.huyphan.models.exceptions.AuthException;
import com.huyphan.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private LoginDataMapper loginDataMapper;

    @Autowired
    private UserSecretMapper userSecretMapper;

    @PostMapping("login")
    public UserSecretDto login(@RequestBody LoginDataDto loginDataDto) throws Exception {
        LoginData loginData = loginDataMapper.fromDto(loginDataDto);
        UserSecret userSecret = authService.login(loginData);
        return userSecretMapper.toDto(userSecret);
    }

   /* @PostMapping("register")
    public UserSecret register(RegisterData registerData) {

    }*/

    @ExceptionHandler(AuthException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AuthException handleAuthExceptions(AuthException exception) {
        return exception;
    }
}
