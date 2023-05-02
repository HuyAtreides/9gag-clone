package com.huyphan.repositories;

import com.huyphan.models.FollowRequest;
import com.huyphan.models.User;
import com.huyphan.models.enums.FollowRequestStatus;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;


public interface FollowRequestRepository extends CrudRepository<FollowRequest, Long> {

    @Override
    @EntityGraph("FollowRequestEntityGraph")
    Optional<FollowRequest> findById(Long id);

    @EntityGraph("FollowRequestEntityGraph")
    Slice<FollowRequest> findByReceiverOrderByIdDesc(User receiver, Pageable pageable);

    @EntityGraph("FollowRequestEntityGraph")
    Slice<FollowRequest> findBySenderOrderByIdDesc(User sender, Pageable pageable);


    @EntityGraph("FollowRequestEntityGraph")
    Slice<FollowRequest> findByReceiverAndStatusOrderByIdDesc(
            User receiver,
            FollowRequestStatus status,
            Pageable pageable
    );

    @EntityGraph("FollowRequestEntityGraph")
    Slice<FollowRequest> findBySenderAndStatusOrderByIdDesc(
            User receiver,
            FollowRequestStatus status,
            Pageable pageable
    );

    FollowRequest findBySenderAndReceiverAndStatus(User sender, User receiver, FollowRequestStatus status);
}
