package com.huyphan.dtos;

import com.huyphan.models.FollowRequest;
import com.huyphan.models.User;
import com.huyphan.models.enums.FollowRequestStatus;
import java.time.Instant;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

@Getter
@Setter
public class FollowRequestDto {

    private Long id;

    private UserDto sender;

    private UserDto receiver;

    private FollowRequestStatus status;

    private String created;
}
