package com.huyphan.repositories;

import com.huyphan.models.Post;
import java.util.Optional;
import javax.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.repository.CrudRepository;

public interface PostRepository extends CrudRepository<Post, Long> {

    @EntityGraph("PostEntityGraph")
    Slice<Post> findAll(Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Post> findWithLockById(Long id);

    @EntityGraph("PostEntityGraph")
    Slice<Post> findBySectionName(String sectionName, Pageable pageable);
}
