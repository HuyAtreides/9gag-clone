package com.huyphan.dtos;

import com.huyphan.models.enums.Country;
import java.util.Set;
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

    private String coverImageUrl;

    private String about;

    private Country country;

    private String created;

    private boolean followed;

    private boolean receivedFollowRequest;
    private boolean isPrivate;

    private boolean blocked;

    private boolean restricted;

    private String blockedTime;

    private String restrictedAt;

    private boolean onlyReceiveMessageFromFollowers;

    private boolean reported;

    private String email;

    public void setIsPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public boolean getIsPrivate() {
        return isPrivate;
    }
}
