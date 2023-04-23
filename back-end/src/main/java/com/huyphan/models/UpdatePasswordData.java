package com.huyphan.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePasswordData {
    public String currentPassword;

    public String newPassword;
}
