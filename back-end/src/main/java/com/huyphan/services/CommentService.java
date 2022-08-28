package com.huyphan.services;

import com.huyphan.models.Comment;
import com.huyphan.models.NewComment;
import com.huyphan.models.Notification;
import com.huyphan.models.PageOptions;
import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.models.builders.AddCommentNotificationBuilder;
import com.huyphan.models.builders.AddReplyNotificationBuilder;
import com.huyphan.models.builders.VoteCommentNotificationBuilder;
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

    @Autowired
    private NotificationSender notificationSender;

    @Autowired
    private VoteCommentNotificationBuilder voteCommentNotificationBuilder;

    @Autowired
    private AddReplyNotificationBuilder addReplyNotificationBuilder;

    @Autowired
    private AddCommentNotificationBuilder addCommentNotificationBuilder;


    @Transactional
    public void addComment(Long postId, NewComment newComment)
            throws PostException {
        Post post = postService.getPost(postId);
        Comment comment = createNewCommentEntity(post, newComment);
        Comment savedComment = commentRepository.save(comment);
        Notification notification = addCommentNotificationBuilder.build(savedComment);
        notificationSender.send(notification, post.getUser());
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
    public void upvotesComment(Long id) throws CommentException {
        Comment comment = getCommentUsingLock(id);
        comment.setUpvotes(comment.getUpvotes() + 1);
        sendVoteCommentNotification(comment);
    }

    @Transactional
    public void unUpvotesComment(Long id) throws CommentException {
        Comment comment = getCommentUsingLock(id);
        comment.setUpvotes(comment.getUpvotes() - 1);
    }

    private void sendVoteCommentNotification(Comment comment) {
        Notification notification = voteCommentNotificationBuilder.build(comment);
        notificationSender.send(notification, comment.getUser());
    }


    @Transactional
    public void downvotesComment(Long id) throws CommentException {
        Comment comment = getCommentUsingLock(id);
        comment.setDownvotes(comment.getDownvotes() + 1);
        sendVoteCommentNotification(comment);
    }

    @Transactional
    public void unDownvotesComment(Long id) throws CommentException {
        Comment comment = getCommentUsingLock(id);
        comment.setDownvotes(comment.getDownvotes() - 1);
    }

    @Transactional
    public void updateComment(Long id, NewComment updatedCommentFields) throws CommentException {
        Comment comment = getComment(id);
        User currentUser = userService.getUser();

        if (!comment.getUser().getUsername().equals(currentUser.getUsername())) {
            throw new CommentException("Comment not found");
        }

        comment.setText(updatedCommentFields.getText());
        comment.setMediaType(updatedCommentFields.getMediaType());
        comment.setMediaUrl(updatedCommentFields.getMediaUrl());
    }

    @Transactional
    public void addReply(NewComment newReply, Long replyToId)
            throws CommentException {
        Comment replyTo = getComment(replyToId);
        Comment reply = createNewCommentEntity(replyTo.getPost(), newReply);
        Comment parent = replyTo.getParent() == null ? replyTo : replyTo.getParent();
        reply.setReplyTo(replyTo);
        reply.setParent(parent);
        Comment savedReply = commentRepository.save(reply);
        Notification notification = addReplyNotificationBuilder.build(savedReply);
        notificationSender.send(notification, replyTo.getUser());
    }

    private Comment createNewCommentEntity(Post post, NewComment newComment) {
        Comment comment = new Comment();
        comment.setUser(userService.getUser());
        comment.setText(newComment.getText());
        comment.setMediaUrl(newComment.getMediaUrl());
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
