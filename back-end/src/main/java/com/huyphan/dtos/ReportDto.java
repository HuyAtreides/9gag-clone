package com.huyphan.dtos;

import com.huyphan.models.User;
import java.time.Instant;
import lombok.Data;


@Data
public class ReportDto {

    private Long id;

    private Instant createdAt;

    private String reason;
}
