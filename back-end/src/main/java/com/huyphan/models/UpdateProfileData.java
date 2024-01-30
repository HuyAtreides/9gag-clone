package com.huyphan.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileData extends RegisterData {
    private String avatarUrl;

    private String coverImgUrl;

    private boolean isPrivate;

    private String about;

    private boolean onlyReceiveMessageFromFollowers;
}
