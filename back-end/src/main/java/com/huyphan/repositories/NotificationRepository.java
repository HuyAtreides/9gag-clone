package com.huyphan.repositories;

import com.huyphan.models.Comment;
import com.huyphan.models.Notification;
import com.huyphan.models.Post;
import com.huyphan.models.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends CrudRepository<Notification, Long> {

    List<Notification> findByUserIdAndIdGreaterThanOrderByIdDesc(Long userId,
            Long id);

    Slice<Notification> findByUserId(Long userId, Pageable pageable);

    @Modifying(clearAutomatically = true)
    @Query("update Notification notification set notification.isViewed = true where notification.user.id = :userId")
    void markAllAsViewed(@Param("userId") Long userId);

    @Modifying(clearAutomatically = true)
    @Query("delete from Notification notification where notification.user.id = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);

    @Query("""
            select user
            from User user
            where :post in elements(user.followingPosts) and user not in :excludeUsers
            """)
    List<User> findAllPostFollowers(@Param("post") Post post,
            @Param("excludeUsers") List<User> excludeUsers);

    @Query("""
            select user
            from User user
            where :comment in elements(user.followingComments) and user not in :excludeUsers
            """)
    List<User> findAllCommentFollowers(@Param("comment") Comment comment,
            @Param("excludeUsers") List<User> excludeUsers);

    Optional<Notification> findByIdAndUserId(Long id, Long userId);

    int countByIsViewedFalseAndUserId(Long userId);
}
