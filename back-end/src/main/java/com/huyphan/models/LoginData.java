package com.huyphan.models;

import lombok.Getter;
import lombok.Setter;

/**
 * Data required for login.
 */
@Getter
@Setter
public class LoginData {

    /**
     * User name.
     */
    private String username;

    /**
     * User password
     */
    private String password;
}
