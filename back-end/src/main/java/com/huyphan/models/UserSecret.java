package com.huyphan.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * User secret.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserSecret {

    /**
     * Token value.
     */
    private String token;
}
