package com.huyphan.models;

import java.time.Instant;
import javax.persistence.Column;
import javax.persistence.Embedded;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewChatMessageData {
    private MessageContent content;

    private Instant sentDate;
}
