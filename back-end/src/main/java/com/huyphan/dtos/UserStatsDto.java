package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserStatsDto {

    private long posts;
    private long comments;
    private long followers;
    private long following;
}
