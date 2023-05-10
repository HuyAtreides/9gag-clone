package com.huyphan.dtos;

import com.huyphan.models.UpdateProfileData;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileDataDto extends RegisterDataDto {
    private String avatarUrl;

    private boolean isPrivate;

    public void setIsPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }
}
