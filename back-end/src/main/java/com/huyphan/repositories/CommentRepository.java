package com.huyphan.repositories;

import com.huyphan.models.Comment;
import com.huyphan.models.User;
import com.huyphan.models.projections.CommentWithDerivedFields;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import javax.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;


public interface CommentRepository extends CrudRepository<Comment, Long> {

    String SELECT_STATEMENT = """
                select
                    comment as comment,
                    
                    (
                        select case when (count(*) > 0) then true else false end
                        from Comment upvotedComment
                        where upvotedComment.id = comment.id and :user in elements(upvotedComment.usersUpvote)
                    ) as isUpvoted,
                    
                    (
                        select case when (count(*) > 0) then true else false end
                        from Comment downvotedComment
                        where downvotedComment.id = comment.id and :user in elements(downvotedComment.usersDownvote)
                    ) as isDownvoted,
                    
                    (
                        select count(*)
                        from Comment children
                        where children.parent = comment
                    ) as totalChildren,
                    
                    (
                        select case when (count(*) > 0) then true else false end
                        from Comment followedComment
                        where followedComment.id = comment.id and :user in elements(followedComment.followers)
                    ) as followed
            """;

    String MODERATING_RESTRICTION = """
            (
                comment.moderating = false or comment.user = :user
            )
            """;
    String BLOCKED_COMMENT_USER_FILTER = """
            (
                not exists (
                                select userBlockRecord
                                from UserBlockRecord userBlockRecord
                                where (
                                        userBlockRecord.blocked = comment.user
                                        and userBlockRecord.blocker = :user
                                      ) or
                                      (
                                        userBlockRecord.blocked = :user
                                        and userBlockRecord.blocker = comment.user
                                      )
                           )
            )
            """;

    String PRIVATE_USER_COMMENT_FILTER = """
            (comment.user = :user or comment.user.isPrivate = false or (
                :user in elements(comment.user.followers))
            )
            """;

    @EntityGraph("CommentEntityGraph")
    @Query(value = SELECT_STATEMENT + """
            from Comment comment
            where comment.parent.id = :parentId and
            """ + BLOCKED_COMMENT_USER_FILTER + "and " + PRIVATE_USER_COMMENT_FILTER
            + "and " + MODERATING_RESTRICTION, countQuery = """
            select count(*)
            from Comment comment
            where comment.parent.id = :parentId
            """)
    Page<CommentWithDerivedFields> findChildrenComments(@Param("user") User user,
            @Param("parentId") Long parentId, Pageable pageable);

    /**
     * Find all parent comments belongs to a post.
     */
    @EntityGraph("CommentEntityGraph")
    @Query(value = SELECT_STATEMENT + """
            from Comment comment
            where comment.post.id = :postId and comment.parent is null and
            """ + BLOCKED_COMMENT_USER_FILTER + "and " + PRIVATE_USER_COMMENT_FILTER
            + "and " + MODERATING_RESTRICTION
            , countQuery = """
            select count(*)
            from Comment comment
            where comment.post.id = :postId and comment.parent is null
            """)
    Page<CommentWithDerivedFields> findParentComments(@Param("user") User user,
            @Param("postId") Long postId, Pageable pageable);

    @EntityGraph("CommentEntityGraph")
    @Query(value = SELECT_STATEMENT + """
            from Comment comment
            where comment.id = :id and
            """ + BLOCKED_COMMENT_USER_FILTER + "and " + PRIVATE_USER_COMMENT_FILTER)
    Optional<CommentWithDerivedFields> findById(@Param("user") User user,
            @Param("id") Long id);

    @Query("""
            select comment
            from Comment comment
            where comment.id = :id and
            """ + BLOCKED_COMMENT_USER_FILTER + "and " + PRIVATE_USER_COMMENT_FILTER)
    Optional<Comment> findByIdWithoutDerivedFields(@Param("user") User user,
            @Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select comment
            from Comment comment
            where comment.id = :id and
            """ + BLOCKED_COMMENT_USER_FILTER + "and " + PRIVATE_USER_COMMENT_FILTER)
    Optional<Comment> findWithLockById(@Param("user") User user, Long id);

    @Query("""
            select leafComment.id
            from Comment leafComment
            where leafComment.post.id = :postId and not exists (
                select comment.id
                from Comment comment
                where comment.replyTo.id = leafComment.id
            )
            """)
    Set<Long> getLeafCommentIdsOfPost(@Param("postId") Long postId);

    @Query("""
            select leafComment.id
            from Comment leafComment
            where leafComment.replyTo.id in :ids
            """)
    Set<Long> getLeafReplyIdsOfComment(@Param("ids") Set<Long> ids);

    @Modifying(clearAutomatically = true)
    @Query("delete from Comment comment where comment.id in :ids")
    void deleteComments(@Param("ids") Set<Long> ids);

    @Query("""
            select comment.mediaUrl
            from Comment comment
            where comment.id in :ids
            """)
    List<String> getMediaUrlByIdIn(Set<Long> ids);

    @EntityGraph("CommentEntityGraph")
    @Query(SELECT_STATEMENT + """
            from Comment comment
            where comment.user = :user and
            """ + BLOCKED_COMMENT_USER_FILTER + "and " + PRIVATE_USER_COMMENT_FILTER)
    Slice<CommentWithDerivedFields> findUserComments(@Param("user") User user, Pageable pageable);

    Comment findByModeratingTrueAndMediaUrl(String mediaUrl);
}
