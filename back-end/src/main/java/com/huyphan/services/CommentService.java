package com.huyphan.services;

import com.huyphan.models.Comment;
import com.huyphan.models.PageOptions;
import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.models.enums.CommentSortField;
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
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @Transactional
    public void addComment(Long postId, Comment comment) throws PostException {
        comment.setUser(userService.getUser());
        Post post = postService.getPost(postId);
        comment.setPost(post);
        commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long id) throws CommentException {
        User currentUser = userService.getUser();
        Comment comment = getComment(id);

        if (!comment.getUser().getUsername().equals(currentUser.getUsername())) {
            throw new CommentException("Comment not found");
        }

        commentRepository.deleteById(id);
    }

    @Transactional
    public void upvotesPost(Long id) throws CommentException {
        Comment comment = getCommentUsingLock(id);
        comment.setUpvotes(comment.getUpvotes() + 1);
    }

    @Transactional
    public void unUpvotesPost(Long id) throws CommentException {
        Comment comment = getCommentUsingLock(id);
        comment.setUpvotes(comment.getUpvotes() - 1);
    }


    @Transactional
    public void downvotesPost(Long id) throws CommentException {
        Comment comment = getCommentUsingLock(id);
        comment.setDownvotes(comment.getDownvotes() + 1);
    }

    @Transactional
    public void unDownvotesPost(Long id) throws CommentException {
        Comment comment = getCommentUsingLock(id);
        comment.setDownvotes(comment.getDownvotes() - 1);
    }

    @Transactional
    public void updateComment(Comment updatedComment) throws CommentException {
        Comment comment = getComment(updatedComment.getId());
        comment.setText(updatedComment.getText());
        comment.setMediaType(updatedComment.getMediaType());
        comment.setMediaUrl(updatedComment.getMediaUrl());
    }

    @Transactional
    public void addReply(Long postId, Comment reply, Long parentCommentId)
            throws CommentException, PostException {
        Comment parent = commentRepository.findWithLockById(parentCommentId)
                .orElseThrow(() -> new CommentException("Parent comment isn't found"));
        Post post = postService.getPostUsingLock(postId);
        reply.setPost(post);
        reply.setParent(parent);
        reply.setUser(userService.getUser());
        commentRepository.save(reply);
    }

    public Page<Comment> getChildrenComment(Long parentId, PageOptions options) {
        Sort sortOptions = Sort.by(Order.desc(CommentSortField.UPVOTES.getValue()),
                Order.desc(CommentSortField.DATE.getValue()));
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);

        return commentRepository.findByParentId(parentId, pageable);
    }

    public Page<Comment> getPostComments(Long postId, PageOptions options) {
        Sort sortOptions = Sort.by(Order.desc(CommentSortField.UPVOTES.getValue()),
                Order.desc(CommentSortField.DATE.getValue()));
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);

        return commentRepository.findByPostIdAndParentIsNull(postId, pageable);
    }

    public Comment getComment(Long id) throws CommentException {
        return commentRepository.findById(id)
                .orElseThrow(() -> new CommentException("Comment not found"));
    }

    /**
     * Read comment using write lock.
     */
    private Comment getCommentUsingLock(Long id) throws CommentException {
        return commentRepository.findWithLockById(id)
                .orElseThrow(() -> new CommentException("Comment not found"));

    }
}
