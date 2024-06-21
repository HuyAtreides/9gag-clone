package com.huyphan.dtos;

import lombok.Data;

@Data
public class ReportUserRequestDto {

    private long userId;

    private String reason;
}
