package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;

/**
 * Register Data DTO.
 */
@Getter
@Setter
public class RegisterDataDto {

    /**
     * Username.
     */
    private String username;

    /**
     * Display name.
     */
    private String displayName;

    /**
     * User country.
     */
    private String country;

    /**
     * User password.
     */
    private String password;
}

