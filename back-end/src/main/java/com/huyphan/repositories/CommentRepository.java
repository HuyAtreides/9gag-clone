package com.huyphan.repositories;

import com.huyphan.models.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.CrudRepository;

public interface CommentRepository extends CrudRepository<Comment, Long> {

    @EntityGraph("CommentWithReplyTo")
    Page<Comment> findCommentWithReplyToByParentId(Long parentId,
            Pageable pageable);

    @EntityGraph("CommentWithReplyTo")
    Page<Comment> findCommentWithReplyToByPostId(Long postId, Pageable pageable);

}
