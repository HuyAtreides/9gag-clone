package com.huyphan.services;

import com.huyphan.models.Comment;
import com.huyphan.models.PageOptions;
import com.huyphan.models.Post;
import com.huyphan.models.exceptions.CommentException;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void addComment(Long postId, Comment comment) throws PostException {
        comment.setUser(userService.getUser());
        Post post = postService.getPost(postId);
        post.setTotalComments(post.getTotalComments() + 1);
        comment.setPost(post);
        commentRepository.save(comment);
    }

    public void deleteComment(Long postId) {
        commentRepository.deleteById(postId);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void upvotesPost(Long id) throws PostException, CommentException {
        Comment comment = getComment(id);
        comment.setUpvotes(comment.getUpvotes() + 1);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void unUpvotesPost(Long id) throws PostException, CommentException {
        Comment comment = getComment(id);
        comment.setUpvotes(comment.getUpvotes() - 1);
    }


    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void downvotesPost(Long id) throws PostException, CommentException {
        Comment comment = getComment(id);
        comment.setDownvotes(comment.getDownvotes() + 1);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void unDownvotesPost(Long id) throws PostException, CommentException {
        Comment comment = getComment(id);
        comment.setDownvotes(comment.getDownvotes() - 1);
    }

    public void updateComment(Comment newComment) {
        newComment.setUser(userService.getUser());
        commentRepository.save(newComment);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void addReply(Long postId, Comment reply, Long parentCommentId)
            throws CommentException, PostException {
        Comment parent = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new CommentException("Parent comment isn't found"));
        Post post = postService.getPost(postId);
        post.setTotalComments(post.getTotalComments() + 1);
        reply.setPost(post);
        reply.setParent(parent);
        reply.setUser(userService.getUser());
        commentRepository.save(reply);
    }

    public Page<Comment> getChildrenComment(Long parentId, PageOptions options) {
        Sort sortOptions = Sort.by(Order.desc("upvotes"), Order.desc("date"));
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);

        return commentRepository.findCommentWithReplyToByParentId(parentId, pageable);
    }

    public Page<Comment> getPostComments(Long postId, PageOptions options) {
        Sort sortOptions = Sort.by(Order.desc("upvotes"), Order.desc("date"));
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);
        Page<Comment> p = commentRepository.findCommentWithReplyToByPostId(postId, pageable);

        return commentRepository.findCommentWithReplyToByPostId(postId, pageable);
    }

    private Comment getComment(Long id) throws CommentException {
        return commentRepository.findById(id)
                .orElseThrow(() -> new CommentException("Post not found"));
    }
}
