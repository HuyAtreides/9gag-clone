package com.huyphan.models;

import com.huyphan.models.converters.NotificationTypeConverter;
import com.huyphan.models.enums.NotificationType;
import java.time.Instant;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DynamicInsert
public abstract class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Long id;

    @Column(name = "Type", nullable = false, length = 50)
    @Convert(converter = NotificationTypeConverter.class)
    private NotificationType type;

    @Lob
    @Column(name = "DestUrl", nullable = false)
    private String destUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId")
    private User user;

    @Column(name = "IsViewed")
    private Boolean isViewed;

    @Column(name = "Created")
    private Instant created;
}