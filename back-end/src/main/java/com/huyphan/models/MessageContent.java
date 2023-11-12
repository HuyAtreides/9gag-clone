package com.huyphan.models;

import com.huyphan.models.converters.PostContentTypeConverter;
import com.huyphan.models.converters.SupportedMIMETypeConverter;
import com.huyphan.models.enums.SupportedMIMEType;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Converter;
import javax.persistence.Embeddable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Lob;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.aspectj.bridge.Message;

@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode
@Getter
@Setter
public class MessageContent {

    @Lob
    @Column(name = "MediaUrl")
    private String mediaUrl;

    @Column(name = "MediaType")
    @Convert(converter = SupportedMIMETypeConverter.class)
    private SupportedMIMEType mediaType;

    @Lob
    @Column(name = "Text")
    private String text;

    public MessageContent withNewMedia(String mediaUrl, SupportedMIMEType mediaType) {
        return new MessageContent(mediaUrl, mediaType, text);
    }

    public MessageContent withNewContent(String mediaUrl, SupportedMIMEType mediaType,
            String text) {
        return new MessageContent(mediaUrl, mediaType, text);
    }

    public static MessageContent empty() {
        return new MessageContent(
                null,
                null,
                ""
        );
    }

    public MessageContent(String mediaUrl, SupportedMIMEType mediaType, String text) {
        if (mediaUrl == null && mediaType == null && text == null) {
            throw new IllegalArgumentException("Invalid Message Content");
        }

        if (text == null && (mediaUrl == null || mediaType == null)) {
            throw new IllegalArgumentException(
                    "Media type and media URL must be non-null together");
        }

        this.mediaType = mediaType;
        this.mediaUrl = mediaUrl;
        this.text = text;
    }
}
