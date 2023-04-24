package com.huyphan.repositories;

import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.models.projections.PostWithDerivedFields;
import java.util.Optional;
import javax.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends CrudRepository<Post, Long> {

    String SELECT_STATEMENT = """
                select
                    post as post,
                    
                    (
                        select case when (count(*) > 0) then true else false end
                        from Post upvotedPost
                        where upvotedPost.id = post.id and :user in elements(upvotedPost.upvoteUsers)
                    ) as isUpvoted,
                    
                    (
                        select case when (count(*) > 0) then true else false end
                        from Post downvotedPost
                        where downvotedPost.id = post.id and :user in elements(downvotedPost.downvoteUsers)
                    ) as isDownvoted,
                    
                    (
                        select case when (count(*) > 0) then true else false end
                        from Post savedPost
                        where savedPost.id = post.id and :user in elements(savedPost.saveUsers)
                    ) as isSaved,
                    
                    (
                        select count(*)
                        from Comment comment
                        where comment.post = post
                    ) as totalComments,
                    
                    (
                        select case when (count(*) > 0) then true else false end
                        from Post followedPost
                        where followedPost.id = post.id and :user in elements(followedPost.followers)
                    ) as followed
            """;

    String SELECT_STATEMENT_WITH_IS_IN_USER_FAV_SECTION_FIELD =
            SELECT_STATEMENT + "," + """
                    (
                        select case when (count(*) > 0) then true else false end
                        from Post postInUserFavSections
                        where postInUserFavSections.id = post.id and postInUserFavSections.section in (
                            select elements(user.favoriteSections) from User user where user = :user
                        )
                    ) as isInUserFavSections
                    """;

    @EntityGraph("PostEntityGraph")
    @Query(SELECT_STATEMENT + """
            from Post post inner join post.saveUsers saveUser
            where :requestUser = saveUser and (
                :searchTerm = '""'
                or freetext(post.tags, :searchTerm) = true
                or freetext(post.title, :searchTerm) = true
                or contains(post.tags, :searchTerm) = true
                or contains(post.title, :searchTerm) = true
            )
            """)
    Slice<PostWithDerivedFields> findSavedPost(
            @Param("requestUser") User requestUser,
            @Param("user") User user,
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );

    @EntityGraph("PostEntityGraph")
    @Query(SELECT_STATEMENT + """
            from Post post
            where :requestUser in elements(post.upvoteUsers) and (
                :searchTerm = '""'
                or freetext(post.tags, :searchTerm) = true
                or freetext(post.title, :searchTerm) = true
                or contains(post.tags, :searchTerm) = true
                or contains(post.title, :searchTerm) = true
            )
            """)
    Slice<PostWithDerivedFields> findVotedPost(
            @Param("requestUser") User requestUser,
            @Param("user") User user,
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );

    @EntityGraph("PostEntityGraph")
    @Query(SELECT_STATEMENT + """
            from Post post inner join post.followers follower
            where :requestUser = follower and (
                :searchTerm = '""'
                or freetext(post.tags, :searchTerm) = true
                or freetext(post.title, :searchTerm) = true
                or contains(post.tags, :searchTerm) = true
                or contains(post.title, :searchTerm) = true
            )
            """)
    Slice<PostWithDerivedFields> findFollowingPost(
            @Param("requestUser") User requestUser,
            @Param("user") User user,
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );

    @EntityGraph("PostEntityGraph")
    @Query(SELECT_STATEMENT + """
            from Post post
            where :requestUser = post.user and (
                :searchTerm = '""'
                or freetext(post.tags, :searchTerm) = true
                or freetext(post.title, :searchTerm) = true
                or contains(post.tags, :searchTerm) = true
                or contains(post.title, :searchTerm) = true
            )
            """)
    Slice<PostWithDerivedFields> findUserPost(
            @Param("requestUser") User requestUser,
            @Param("user") User user,
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );

    @EntityGraph("PostEntityGraph")
    @Query(SELECT_STATEMENT + """
            from Post post
            where post.id = :id
            """)
    Optional<PostWithDerivedFields> findByPostId(@Param("user") User user, Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Post> findWithLockById(Long id);

    @EntityGraph("PostEntityGraph")
    @Query(SELECT_STATEMENT_WITH_IS_IN_USER_FAV_SECTION_FIELD + """
            from Post post
            where post.section.name = :sectionName and (
                :searchTerm = '""'
                or freetext(post.tags, :searchTerm) = true
                or freetext(post.title, :searchTerm) = true
                or contains(post.tags, :searchTerm) = true
                or contains(post.title, :searchTerm) = true
            )
            """)
    Slice<PostWithDerivedFields> findBySectionName(
            @Param("user") User user,
            @Param("sectionName") String sectionName,
            @Param("searchTerm") String search,
            Pageable pageable);

    @EntityGraph("PostEntityGraph")
    @Query(SELECT_STATEMENT_WITH_IS_IN_USER_FAV_SECTION_FIELD + """
            from Post post
            where :searchTerm = '""'
                or freetext(post.tags, :searchTerm) = true
                or freetext(post.title, :searchTerm) = true
                or contains(post.tags, :searchTerm) = true
                or contains(post.title, :searchTerm) = true
            """
    )
    Slice<PostWithDerivedFields> findAll(
            @Param("user") User user,
            @Param("searchTerm") String search,
            Pageable pageable
    );
}
