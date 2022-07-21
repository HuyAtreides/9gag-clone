package com.huyphan.dtos;

import com.huyphan.models.enums.Country;
import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;

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
    @Nullable
    private Country country;

    /**
     * User password.
     */
    private String password;
}

