package com.huyphan.dtos;

import lombok.Data;

@Data
public class ResetPasswordRequestDto {
    private String newPassword;
    private String code;
    private String email;
}
