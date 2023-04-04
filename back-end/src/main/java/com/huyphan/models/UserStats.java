package com.huyphan.models;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserStats {

    private long posts;
    private long comments;
    private int followers;
    private int following;

}
