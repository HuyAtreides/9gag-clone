package com.huyphan.dtos;

import com.huyphan.models.enums.Country;
import javax.persistence.Column;
import lombok.Getter;
import lombok.Setter;

/**
 * User DTO.
 */
@Setter
@Getter
public class UserDto {

    private long id;

    private String username;

    private String avatarUrl;

    private String displayName;

    private Country country;

    private String created;

    private boolean followed;
    private boolean isPrivate;

    public void setIsPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public boolean getIsPrivate() {
        return isPrivate;
    }
}
