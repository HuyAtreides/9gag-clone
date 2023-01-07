package com.huyphan.repositories;

import com.huyphan.models.Post;
import com.huyphan.models.Section;
import com.huyphan.models.User;
import java.util.Optional;
import java.util.Set;
import javax.persistence.LockModeType;
import org.springframework.data.domain.Page;
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
            select post
            from Post post
            where :user in post.saveUsers
            """)
    Slice<Post> findSavedPost(@Param("user") User user, Pageable pageable);

    @EntityGraph("PostEntityGraph")
    @Query("""
            select post
            from Post post
            where :user in post.upvoteUsers
            """)
    Slice<Post> findVotedPost(@Param("user") User user, Pageable pageable);

    @EntityGraph("PostEntityGraph")
    Optional<Post> findById(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Post> findWithLockById(Long id);

    @EntityGraph("PostEntityGraph")
    @Query("""
            select post
            from Post post
            where post.section.name = :sectionName and :searchTerm = '""'
                or freetext(post.title, :searchTerm) = true
                or freetext(post.tags, :searchTerm) = true
            """)
    Slice<Post> findBySectionName(
            @Param("sectionName") String sectionName,
            @Param("searchTerm") String search,
            Pageable pageable);

    @EntityGraph("PostEntityGraph")
    @Query("""
            select post
            from Post post
            where :searchTerm = '""' or freetext(post.title, :searchTerm) = true or freetext(post.tags, :searchTerm) = true
            """)
    Slice<Post> findAll(
            @Param("searchTerm") String search, Pageable pageable);

    @EntityGraph("PostEntityGraph")
    @Query(value = """
            select post
            from Post post
            where post.section in :sections
                and
            :searchTerm = '""' or freetext(post.title, :searchTerm) = true or freetext(post.tags, :searchTerm) = true
            """, countQuery = """
            select count(*)
            from Post post
            where post.section in :sections
                and
            :searchTerm = '""' or freetext(post.title, :searchTerm) = true or freetext(post.tags, :searchTerm) = true
            """)
    Page<Post> findAllPostInUserFavSection(@Param("sections") Set<Section> sections,
            @Param("searchTerm") String search, Pageable pageable);

    @EntityGraph("PostEntityGraph")
    @Query(value = """
            select post
            from Post post
            where  post.section not in :sections
                and
            :searchTerm = '""' or freetext(post.title, :searchTerm) = true or freetext(post.tags, :searchTerm) = true
            """)
    Slice<Post> findAllPostNotInUserFavSection(@Param("sections") Set<Section> sections,
            @Param("searchTerm") String search, Pageable pageable);
}
