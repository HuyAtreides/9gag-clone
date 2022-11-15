package com.huyphan.repositories;

import com.huyphan.models.Post;
import java.util.Optional;
import javax.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends CrudRepository<Post, Long> {

    String SELECT_POST = """
            select
                post.id,
                post.sectionId,
                post.userId,
                post.upvotes,
                post.downvotes,
                post.mediaType,
                post.mediaUrl,
                post.tags,
                post.title,
                post.uploadTime,
                (select count(*)
                 from Comment comment
                 where comment.postId = post.id
                ) as totalComments,
                
                (select convert(bit, count(*))
                 from UpvotedPost upvotedPost
                 where upvotedPost.postId = post.id and upvotedPost.userId = :currentUserId
                 ) as isUpvoted,
                 
                (select convert(bit, count(*))
                 from DownvotedPost downvotedPost
                 where downvotedPost.postId = post.id and downvotedPost.userId = :currentUserId
                 ) as isDownvoted
            """;


    @Query(value = SELECT_POST + """
            from Post post inner join SavedPost savedPost on post.id = savedPost.postId
            where savedPost.userId = :currentUserId
            """, nativeQuery = true)
    Slice<Post> findSavedPost(@Param("currentUserId") Long currentUserId);

    @Query(value = SELECT_POST + """
            from Post post inner join UpvotedPost upvotedPost on post.id = upvotedPost.postId
            where upvotedPost.userId = :currentUserId
            """, nativeQuery = true)
    Slice<Post> findVotedPost(@Param("currentUserId") Long currentUserId);

    @Query(value = SELECT_POST + """
            from Post post
            where post.id = :id
            """, nativeQuery = true)
    Optional<Post> findById(@Param("currentUserId") Long currentUserId, Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Post> findWithLockById(Long id);

    @Query(value = SELECT_POST + """
            from Post post inner join Section section on post.sectionId = section.id
            where section.name = :sectionName and (:searchTerm = '""' or freetext(title, :searchTerm) or freetext(tags, :searchTerm))
            """, nativeQuery = true)
    Slice<Post> findBySectionName(@Param("currentUserId") Long currentUserId,
            @Param("sectionName") String sectionName,
            @Param("searchTerm") String search,
            Pageable pageable);

    @Query(value = SELECT_POST + """
                from Post post inner join Section section on post.sectionId = section.id
                where :searchTerm = '""' or freetext(title, :searchTerm) or freetext(tags, :searchTerm)
            """, nativeQuery = true)
    Slice<Post> findAll(@Param("currentUserId") Long currentUserId,
            @Param("searchTerm") String search, Pageable pageable);
}
