package com.huyphan.models;

import lombok.Data;

@Data
public class ReportUserRequest {
    private long userId;

    private String reason;
}
