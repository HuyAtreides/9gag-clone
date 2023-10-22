package com.huyphan.dtos;

import com.huyphan.models.enums.SupportedMIMEType;
import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageContentDto {
    private String mediaUrl;

    private SupportedMIMEType mediaType;

    private String text;
}
