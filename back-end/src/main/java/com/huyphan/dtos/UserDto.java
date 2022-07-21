package com.huyphan.dtos;

import com.huyphan.models.enums.Country;
import java.util.Set;
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

    private Set<SectionDto> favoriteSections;

}
