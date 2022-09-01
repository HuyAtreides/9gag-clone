package com.huyphan.repositories;

import com.huyphan.models.Post;
import com.huyphan.models.User;
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

    @EntityGraph("PostEntityGraph")
    @Query("""
            select p
            from Post p join p.saveUsers saveUsers
            where :user in saveUsers
            """)
    Slice<Post> findSavedPost(@Param("user") User user);

    @EntityGraph("PostEntityGraph")
    @Query("""
            select p
            from Post p join p.voteUsers voteUsers
            where :user in voteUsers
            """)
    Slice<Post> findVotedPost(@Param("user") User user);

    @EntityGraph("PostEntityGraph")
    Slice<Post> findAll(Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Post> findWithLockById(Long id);

    @EntityGraph("PostEntityGraph")
    Slice<Post> findBySectionName(String sectionName, Pageable pageable);
}
