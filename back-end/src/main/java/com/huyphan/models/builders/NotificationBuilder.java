package com.huyphan.models.builders;

import com.huyphan.models.Notification;
import org.springframework.web.util.UriComponentsBuilder;

public interface NotificationBuilder {

    UriComponentsBuilder destUrlBuilder = UriComponentsBuilder.fromPath("/notification");

    Notification build();

    String buildDestUrl();
}
