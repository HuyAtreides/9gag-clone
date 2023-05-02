package com.huyphan.repositories;

import com.huyphan.models.User;
import com.huyphan.models.UserStats;
import com.huyphan.models.enums.SocialProvider;
import com.huyphan.models.projections.UserWithDerivedFields;
import java.util.Optional;
import javax.swing.text.html.Option;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.PathVariable;

public interface UserRepository extends CrudRepository<User, Long> {

    String SELECT_STATEMENT = """
            select
                user as user,
                
                (
                    select case when (count(*) > 0) then true else false end
                    from User followedUser
                    where followedUser = user and :currentUser in elements(followedUser.followers)
                ) as isFollowedByCurrentUser,
                
                (
                    select case when (count(*) > 0) then true else false end
                    from FollowRequest followRequest
                    where followRequest.receiver = user
                        and followRequest.sender = :currentUser
                        and followRequest.status = 0
                ) as isReceivedFollowRequestFromCurrentUser    
            """;

    Optional<User> findByUsername(String username);

    @Query(SELECT_STATEMENT + """
            from User user
            where user.id = :id
            """)
    Optional<UserWithDerivedFields> findByUserId(
            @PathVariable("id") Long id,
            @PathVariable("currentUser") User currentUser
    );

    boolean existsByUsername(String username);

    Optional<User> findByProviderAndSocialId(SocialProvider provider, String socialId);

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

    @Query(SELECT_STATEMENT + """
            from User user
            where :user in elements(user.following)
            """)
    Slice<UserWithDerivedFields> getUserFollowers(@Param("user") User user, @Param("currentUser") User currentUser,
            Pageable pageable);

    @Query(SELECT_STATEMENT + """
            from User user
            where :user in elements(user.followers)
            """)
    Slice<UserWithDerivedFields> getUserFollowing(@Param("user") User user, @Param("currentUser") User currentUser,
            Pageable pageable);
}
