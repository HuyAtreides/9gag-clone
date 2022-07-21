package com.huyphan.models;

import com.huyphan.models.enums.Country;
import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;

/**
 * Data required for register.
 */
@Getter
@Setter
public class RegisterData {

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
