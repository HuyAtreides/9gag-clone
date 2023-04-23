package com.huyphan.models;

import com.huyphan.models.enums.SocialProvider;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SocialLoginData extends RegisterData {
    private SocialProvider provider;

    private String avatarUrl;

    private String socialId;
}
