package com.huyphan.models;

import java.time.Instant;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "RestrictRecord")
@NoArgsConstructor
@Getter
public class RestrictRecord {

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        RestrictRecord that = (RestrictRecord) o;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "RestrictingId")
    private User restricting;

    @ManyToOne
    @JoinColumn(name = "RestrictedId")
    private User restricted;

    @Column(name = "RestrictAt")
    private Instant restrictAt;

    public RestrictRecord(User restricting, User restricted) {
        if (restricting.equals(restricted)) {
            throw new IllegalArgumentException("Can not restrict yourself");
        }

        this.restricting = restricting;
        this.restricted = restricted;
        this.restrictAt = Instant.now();
    }

    public boolean appliedFor(User user) {
        return restricted.equals(user);
    }

}
