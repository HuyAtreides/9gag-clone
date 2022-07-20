package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;

/**
 * Login Data DTO.
 */
@Getter
@Setter
public class LoginDataDto {

    /**
     * User name.
     */
    private String username;

    /**
     * User password
     */
    private String password;
}
