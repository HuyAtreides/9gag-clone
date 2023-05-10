package com.huyphan.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileData extends RegisterData {
    private String avatarUrl;

    private boolean isPrivate;
}
