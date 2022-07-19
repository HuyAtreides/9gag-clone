package com.huyphan.controllers;

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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("login")
    public UserSecret login(@RequestBody LoginData loginData) throws Exception {
        return authService.login(loginData);
    }

   /* @PostMapping("register")
    public UserSecret register(RegisterData registerData) {

    }*/

    @ExceptionHandler(AuthException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AuthException handleAuthExceptions(AuthException exception) {
        return exception;
    }
}
