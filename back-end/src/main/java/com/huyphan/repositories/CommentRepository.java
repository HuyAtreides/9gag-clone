package com.huyphan.repositories;

import com.huyphan.models.Comment;
import java.util.Optional;
import javax.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.repository.CrudRepository;


public interface CommentRepository extends CrudRepository<Comment, Long> {

    @EntityGraph("CommentEntityGraph")
    Page<Comment> findByParentId(Long parentId, Pageable pageable);

    /**
     * Find all parent comments belongs to a post.
     */
    @EntityGraph("CommentEntityGraph")
    Page<Comment> findByPostIdAndParentIsNull(Long postId, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Comment> findWithLockById(Long id);
}
