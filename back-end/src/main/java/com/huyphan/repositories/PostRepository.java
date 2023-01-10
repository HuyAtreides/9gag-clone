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
                        select count(*)
                        from Comment comment
                        where comment.post = post
                    ) as totalComments
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
            from Post post
            where :user in elements(post.saveUsers)
            """)
    Slice<PostWithDerivedFields> findSavedPost(@Param("user") User user, Pageable pageable);

    @EntityGraph("PostEntityGraph")
    @Query(SELECT_STATEMENT + """
            from Post post
            where :user in elements(post.upvoteUsers)
            """)
    Slice<PostWithDerivedFields> findVotedPost(@Param("user") User user, Pageable pageable);

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
            where post.section.name = :sectionName and :searchTerm = '""'
                or freetext(post.title, :searchTerm) = true
                or freetext(post.tags, :searchTerm) = true
            """)
    Slice<PostWithDerivedFields> findBySectionName(
            @Param("user") User user,
            @Param("sectionName") String sectionName,
            @Param("searchTerm") String search,
            Pageable pageable);

    @EntityGraph("PostEntityGraph")
    @Query(SELECT_STATEMENT_WITH_IS_IN_USER_FAV_SECTION_FIELD + """
            from Post post
            where :searchTerm = '""' or freetext(post.title, :searchTerm) = true 
            or freetext(post.tags, :searchTerm) = true
            """
    )
    Slice<PostWithDerivedFields> findAll(
            @Param("user") User user,
            @Param("searchTerm") String search,
            Pageable pageable
    );
}
