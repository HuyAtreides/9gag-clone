package com.huyphan.dtos;

import lombok.Getter;

@Getter
public class UpdatePasswordDataDto {
    public String currentPassword;

    public String newPassword;
}
