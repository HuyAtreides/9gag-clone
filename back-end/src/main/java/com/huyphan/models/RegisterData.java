package com.huyphan.models;

import lombok.Getter;
import lombok.Setter;

/**
 * Data required for register.
 */
@Getter
@Setter
public class RegisterData {

    private String username;

    private String displayName;

    private String country;

    private String password;
}
