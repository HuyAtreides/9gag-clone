package com.huyphan.repositories;

import com.huyphan.models.Notification;
import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends CrudRepository<Notification, Long> {

    List<Notification> findByCreatedGreaterThan(Instant targetDate);

    Slice<Notification> findByUserId(Long userId, Pageable pageable);

    @Modifying(clearAutomatically = true)
    @Query("update Notification notification set notification.isViewed = true where notification.user.id = :userId")
    void markAllAsViewed(@Param("userId") Long userId);

    @Modifying(clearAutomatically = true)
    @Query("delete from Notification notification where notification.user.id = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
}
