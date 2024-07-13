package com.huyphan.models;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String newPassword;
    private String code;
    private String email;
}
