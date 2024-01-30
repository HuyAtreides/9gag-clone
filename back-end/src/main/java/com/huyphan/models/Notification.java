package com.huyphan.models;

import com.huyphan.models.converters.NotificationTypeConverter;
import com.huyphan.models.enums.NotificationType;
import java.time.Instant;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
@DynamicInsert
public class Notification {

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SenderId")
    private User sender;

    @Column(name = "IsViewed")
    private Boolean isViewed;

    @Column(name = "Created")
    private Instant created;

    @Lob
    @Column(name = "Message")
    private String message;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Notification that = (Notification) o;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}