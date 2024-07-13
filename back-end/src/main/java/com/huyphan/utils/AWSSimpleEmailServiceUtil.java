package com.huyphan.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.Body;
import software.amazon.awssdk.services.ses.model.Content;
import software.amazon.awssdk.services.ses.model.Destination;
import software.amazon.awssdk.services.ses.model.Message;
import software.amazon.awssdk.services.ses.model.SendEmailRequest;

@Component
@Slf4j
public class AWSSimpleEmailServiceUtil {

    @Autowired
    private SesClient sesClient;

    public void sendCode(String receiptEmail, String code) {
        Content content = Content.builder()
                .data("<h1> " + code + "</h1>")
                .build();

        Content sub = Content.builder()
                .data("Reset password code")
                .build();

        Body body = Body.builder()
                .html(content)
                .build();

        Message message = Message.builder()
                .subject(sub)
                .body(body)
                .build();

        sesClient.sendEmail(
                SendEmailRequest.builder()
                        .source("no-reply@9gagclone.site")
                        .destination(
                                Destination.builder()
                                        .toAddresses(receiptEmail)
                                        .build()
                        )
                        .message(message)
                        .build()
        );
        log.info("Successfully send reset password to {}", receiptEmail);
    }
}
