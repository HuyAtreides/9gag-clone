package com.huyphan.repositories;

import com.huyphan.models.User;
import com.huyphan.models.UserStats;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends CrudRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("""
            select new com.huyphan.models.UserStats(
                (
                    select count(*)
                    from Post post
                    where post.user = :user
                ),
                (
                    select count(*)
                    from Comment comment
                    where comment.user = :user
                ),
                size(user.followers),
                size(user.followingUsers)
               
            )
                From User user       
                where user = :user
            """)
    UserStats getUserStats(@Param("user") User user);

    @Query("""
            select user
            from User user
            where :user in elements(user.following)
            """)
    Page<User> getUserFollowers(@Param("user") User user, Pageable pageable);

    @Query("""
            select user
            from User user
            where :user in elements(user.followers)
            """)
    Page<User> getUserFollowing(@Param("user") User user, Pageable pageable);
}
