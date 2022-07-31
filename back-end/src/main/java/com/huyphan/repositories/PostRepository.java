package com.huyphan.repositories;

import com.huyphan.models.Post;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.CrudRepository;

public interface PostRepository extends CrudRepository<Post, Long> {

    @EntityGraph("PostEntityGraph")
    Slice<Post> findAll(Pageable pageable);

    @EntityGraph("PostEntityGraph")
    Post findByUserId(Long userId);
}
