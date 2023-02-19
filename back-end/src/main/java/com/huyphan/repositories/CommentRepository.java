package com.huyphan.repositories;

import com.huyphan.models.Comment;
import com.huyphan.models.User;
import com.huyphan.models.projections.CommentWithDerivedFields;
import java.util.Optional;
import javax.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Lock;
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
                    ) as totalChildren
            """;

    @EntityGraph("CommentEntityGraph")
    @Query(value = SELECT_STATEMENT + """
            from Comment comment
            where comment.parent.id = :parentId
            """, countQuery = """
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
            where comment.post.id = :postId and comment.parent is null
            """, countQuery = """
            select count(*)
            from Comment comment
            where comment.post.id = :postId and comment.parent is null
            """)
    Page<CommentWithDerivedFields> findParentComments(@Param("user") User user,
            @Param("postId") Long postId, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Comment> findWithLockById(Long id);
}
