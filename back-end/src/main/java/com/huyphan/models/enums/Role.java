package com.huyphan.models.enums;

import lombok.Getter;

@Getter
public enum Role {
    USER("User");

    private final String roleName;

    Role(String roleName) {
        this.roleName = roleName;
    }
}
