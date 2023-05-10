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
import org.springframework.data.repository.query.Param;


public interface FollowRequestRepository extends CrudRepository<FollowRequest, Long> {

    String SENDER_BLOCKED_FILTER = """
            (
                 not exists (
                                select userBlockRecord
                                from UserBlockRecord userBlockRecord
                                where (
                                        userBlockRecord.blocked = :sender
                                        and userBlockRecord.blocker = request.receiver
                                      ) or
                                      (
                                        userBlockRecord.blocked = request.receiver
                                        and userBlockRecord.blocker = :sender
                                      )
                           )
            )
            """;

    String RECEIVER_BLOCKED_FILTER = """
            (
                 not exists (
                                select userBlockRecord
                                from UserBlockRecord userBlockRecord
                                where (
                                        userBlockRecord.blocked = request.sender
                                        and userBlockRecord.blocker = :receiver
                                      ) or
                                      (
                                        userBlockRecord.blocked = :receiver
                                        and userBlockRecord.blocker = request.sender
                                      )
                           )
            )
            """;

    String USER_BLOCKED_FILTER = """
            (
                 not exists (
                                select userBlockRecord
                                from UserBlockRecord userBlockRecord
                                where (
                                        userBlockRecord.blocked = request.sender
                                        and userBlockRecord.blocker = :currentUser
                                      ) or
                                      (
                                        userBlockRecord.blocked = :currentUser
                                        and userBlockRecord.blocker = request.sender
                                      ) or
                                      (
                                        userBlockRecord.blocked = request.receiver
                                        and userBlockRecord.blocker = :currentUser
                                      ) or
                                      (
                                        userBlockRecord.blocked = :currentUser
                                        and userBlockRecord.blocker = request.receiver
                                      )
                           )
            )
            """;

    @EntityGraph("FollowRequestEntityGraph")
    @Query("""
            select request
            from FollowRequest request
            where request.id = :id and
            """ + USER_BLOCKED_FILTER)
    Optional<FollowRequest> findById(Long id, @Param("currentUser") User user);

    @EntityGraph("FollowRequestEntityGraph")
    @Query("""
            select request
            from FollowRequest request
            where request.receiver = :receiver and
            """ + RECEIVER_BLOCKED_FILTER)
    Slice<FollowRequest> findByReceiver(@Param("receiver") User receiver, Pageable pageable);

    @EntityGraph("FollowRequestEntityGraph")
    @Query("""
            select request
            from FollowRequest request
            where request.sender = :sender and
            """ + SENDER_BLOCKED_FILTER)
    Slice<FollowRequest> findBySender(@Param("sender") User sender, Pageable pageable);


    @EntityGraph("FollowRequestEntityGraph")
    @Query("""
            select request
            from FollowRequest request
            where request.receiver = :receiver and
                request.status = :status and
            """ + RECEIVER_BLOCKED_FILTER)
    Slice<FollowRequest> findByReceiverAndStatus(
            @Param("receiver") User receiver,
            @Param("status") FollowRequestStatus status,
            Pageable pageable
    );

    @EntityGraph("FollowRequestEntityGraph")
    @Query("""
            select request
            from FollowRequest request
            where request.sender = :sender and
            request.status = :status and
            """ + SENDER_BLOCKED_FILTER)
    Slice<FollowRequest> findBySenderAndStatus(
            @Param("sender") User sender,
            @Param("status") FollowRequestStatus status,
            Pageable pageable
    );

    FollowRequest findBySenderAndReceiverAndStatus(User sender, User receiver, FollowRequestStatus status);
}
