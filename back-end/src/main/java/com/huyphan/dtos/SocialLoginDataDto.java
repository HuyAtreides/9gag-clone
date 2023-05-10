package com.huyphan.dtos;

import com.huyphan.models.enums.SocialProvider;
import lombok.Getter;

@Getter
public class SocialLoginDataDto extends RegisterDataDto{
    private SocialProvider provider;

    private String avatarUrl;

    private String socialId;
}
