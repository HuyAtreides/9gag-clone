package com.huyphan.controllers;

import com.huyphan.dtos.LoginDataDto;
import com.huyphan.dtos.RegisterDataDto;
import com.huyphan.dtos.UserSecretDto;
import com.huyphan.mappers.LoginDataMapper;
import com.huyphan.mappers.RegisterDataMapper;
import com.huyphan.mappers.UserSecretMapper;
import com.huyphan.models.LoginData;
import com.huyphan.models.RegisterData;
import com.huyphan.models.UserSecret;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.AuthException;
import com.huyphan.models.exceptions.UserAlreadyExistsException;
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
    private RegisterDataMapper registerDataMapper;

    @Autowired
    private UserSecretMapper userSecretMapper;

    @PostMapping("login")
    public UserSecretDto login(@RequestBody LoginDataDto loginDataDto) throws Exception {
        LoginData loginData = loginDataMapper.fromDto(loginDataDto);
        UserSecret userSecret = authService.login(loginData);
        return userSecretMapper.toDto(userSecret);
    }

    @PostMapping("register")
    public UserSecretDto register(@RequestBody RegisterDataDto registerDataDto)
            throws UserAlreadyExistsException {
        RegisterData registerData = registerDataMapper.fromDto(registerDataDto);
        UserSecret userSecret = authService.register(registerData);
        return userSecretMapper.toDto(userSecret);
    }

    @ExceptionHandler({AuthException.class, UserAlreadyExistsException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppException handleAuthExceptions(AppException exception) {
        return exception;
    }


}
