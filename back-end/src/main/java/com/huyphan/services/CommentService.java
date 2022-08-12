package com.huyphan.services;

import com.huyphan.models.Comment;
import com.huyphan.models.NewComment;
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
    public void addComment(Long postId, NewComment newComment)
            throws PostException, CommentException {
        Comment comment = createNewCommentEntity(postId, newComment);
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
    public void addReply(Long postId, NewComment newReply, Long parentCommentId)
            throws CommentException, PostException {
        Comment parent = getComment(parentCommentId);
        Comment reply = createNewCommentEntity(postId, newReply);
        Comment replyToComment = getComment(newReply.getReplyToId());
        reply.setReplyTo(replyToComment);
        reply.setParent(parent);
        commentRepository.save(reply);
    }

    private Comment createNewCommentEntity(Long postId, NewComment newComment)
            throws PostException, CommentException {
        Comment comment = new Comment();
        Post post = postService.getPost(postId);
        comment.setUser(userService.getUser());
        comment.setText(newComment.getText());
        comment.setMediaUrl(newComment.getMediaUrl());
        comment.setDate(newComment.getDate());
        comment.setPost(post);
        comment.setMediaType(newComment.getMediaType());
        return comment;
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
