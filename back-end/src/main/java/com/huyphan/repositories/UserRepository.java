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
                ) as isReceivedFollowRequestFromCurrentUser,
                
                (
                    select case when (count(*) > 0) then true else false end
                    from UserBlockRecord userBlockRecord
                    where userBlockRecord.blocked = user
                        and userBlockRecord.blocker = :currentUser
                ) as blocked,
                
                (
                    select userBlockRecord.created
                    from UserBlockRecord userBlockRecord
                    where userBlockRecord.blocked = user
                        and userBlockRecord.blocker = :currentUser
                ) as blockedTime
            """;
    String BLOCKED_USER_RESTRICTION = """
            (
                not exists (
                                select userBlockRecord
                                from UserBlockRecord userBlockRecord
                                where (
                                        userBlockRecord.blocked = user
                                        and userBlockRecord.blocker = :currentUser
                                      ) or
                                      (
                                        userBlockRecord.blocked = :currentUser
                                        and userBlockRecord.blocker = user
                                      )
                           )
            )
            """;

    Optional<User> findByUsername(String username);

    @Query(SELECT_STATEMENT + """
            from User user
            where user.id = :id and
            """ + BLOCKED_USER_RESTRICTION)
    Optional<UserWithDerivedFields> findByUserId(
            @PathVariable("id") Long id,
            @PathVariable("currentUser") User currentUser
    );

    @Query("""
            select user
            from User user
            where user.id = :id and
            """ + BLOCKED_USER_RESTRICTION)
    Optional<User> findById(
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
                where user = :user and
            """ + BLOCKED_USER_RESTRICTION)
    UserStats getUserStats(@Param("user") User user, @Param("currentUser") User currentUser);

    @Query(SELECT_STATEMENT + """
            from User user
            where :user in elements(user.following) and
            """ + BLOCKED_USER_RESTRICTION)
    Slice<UserWithDerivedFields> getUserFollowers(@Param("user") User user,
            @Param("currentUser") User currentUser,
            Pageable pageable);

    @Query(SELECT_STATEMENT + """
            from User user
            where :user in elements(user.followers) and
            """ + BLOCKED_USER_RESTRICTION)
    Slice<UserWithDerivedFields> getUserFollowing(@Param("user") User user,
            @Param("currentUser") User currentUser,
            Pageable pageable);

    @Query(SELECT_STATEMENT + """
            From User user
            where :currentUser in elements(user.blockedBy)
            """)
    Slice<UserWithDerivedFields> getBlockedUsers(@Param("currentUser") User currentUser, Pageable pageable);

    @Query("""
            select user
            from User user
            where (lower(user.username) like :searchTerm or lower(user.displayName) like :searchTerm) and
            """ + BLOCKED_USER_RESTRICTION)
    Slice<User> searchUser(@Param("searchTerm") String searchTerm, @Param("currentUser") User currentUser, Pageable pageable);

    @Query("""
            select user
            from User current inner join current.recentSearch user
            where current = :currentUser and
            """ + BLOCKED_USER_RESTRICTION)
    Slice<User> getRecentSearch(@Param("currentUser") User user, Pageable pageable);
}
