package com.huyphan.dtos;

import com.huyphan.models.enums.NotificationType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationDto {

    private Long id;

    private NotificationType type;

    private String destUrl;

    private Boolean isViewed;

    private String created;
}
