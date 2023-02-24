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
import com.huyphan.models.enums.SortType;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.CommentException;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.models.exceptions.VoteableObjectException;
import com.huyphan.models.projections.CommentWithDerivedFields;
import com.huyphan.repositories.CommentRepository;
import com.huyphan.utils.AWSS3Util;
import com.huyphan.utils.sortoptionsconstructor.SortTypeToSortOptionBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    private SortTypeToSortOptionBuilder commentSortTypeToSortOptionBuilder;

    @Autowired
    private NotificationSender notificationSender;

    @Autowired
    private VoteableObjectManager<Comment> voteableCommentManager;

    @Autowired
    private VoteCommentNotificationBuilder voteCommentNotificationBuilder;

    @Autowired
    private AddReplyNotificationBuilder addReplyNotificationBuilder;

    @Autowired
    private AddCommentNotificationBuilder addCommentNotificationBuilder;

    @Autowired
    private AWSS3Util awss3Util;

    @Transactional
    public Comment addComment(Long postId, NewComment newComment)
            throws PostException, CommentException {
        Post post = postService.getPost(postId);
        Comment comment = createNewCommentEntity(post, newComment);
        Comment savedComment = commentRepository.save(comment);
        Notification notification = addCommentNotificationBuilder.build(savedComment);
        notificationSender.send(notification, post.getUser());

        return savedComment;
    }

    @Transactional(rollbackFor = {Exception.class})
    public void deleteComment(Long id) throws CommentException {
        User currentUser = UserService.getUser();
        Comment comment = getComment(id);

        if (!comment.getUser().getUsername().equals(currentUser.getUsername())) {
            throw new CommentException("Comment not found");
        }

        awss3Util.deleteObject(comment.getMediaUrl());
        commentRepository.deleteById(id);
    }

    @Transactional(rollbackFor = {VoteableObjectException.class})
    public void upvotesComment(Long id) throws CommentException, VoteableObjectException {
        Comment comment = getCommentUsingLock(id);

        if (voteableCommentManager.getDownvotedObjects().contains(comment)) {
            unDownvotesComment(id);
        }

        voteableCommentManager.addUpvotedObject(comment);
        comment.setUpvotes(comment.getUpvotes() + 1);
        sendVoteCommentNotification(comment);
    }

    @Transactional(rollbackFor = {VoteableObjectException.class})
    public void unUpvotesComment(Long id) throws CommentException, VoteableObjectException {
        Comment comment = getCommentUsingLock(id);
        boolean isRemoved = voteableCommentManager.removeUpvotedObject(comment);

        if (isRemoved) {
            comment.setUpvotes(comment.getUpvotes() - 1);
        }
    }

    private void sendVoteCommentNotification(Comment comment) {
        Notification notification = voteCommentNotificationBuilder.build(comment);
        notificationSender.send(notification, comment.getUser());
    }


    @Transactional(rollbackFor = {VoteableObjectException.class})
    public void downvotesComment(Long id) throws CommentException, VoteableObjectException {
        Comment comment = getCommentUsingLock(id);

        if (voteableCommentManager.getUpvotedObjects().contains(comment)) {
            unUpvotesComment(id);
        }

        voteableCommentManager.addDownVotedObject(comment);
        comment.setDownvotes(comment.getDownvotes() + 1);
        sendVoteCommentNotification(comment);
    }

    @Transactional(rollbackFor = {VoteableObjectException.class})
    public void unDownvotesComment(Long id) throws CommentException, VoteableObjectException {
        Comment comment = getCommentUsingLock(id);
        boolean isRemoved = voteableCommentManager.removeDownvotedObject(comment);

        if (isRemoved) {
            comment.setDownvotes(comment.getDownvotes() - 1);
        }
    }

    @Transactional
    public void updateComment(Long id, NewComment updatedCommentFields) throws CommentException {
        Comment comment = getComment(id);
        User currentUser = UserService.getUser();
        validateNewComment(updatedCommentFields);

        if (!comment.getUser().getUsername().equals(currentUser.getUsername())) {
            throw new CommentException("Comment not found");
        }

        comment.setText(updatedCommentFields.getText());
        comment.setMediaType(updatedCommentFields.getMediaType());
        comment.setMediaUrl(updatedCommentFields.getMediaUrl());
    }

    @Transactional
    public Comment addReply(NewComment newReply, Long replyToId)
            throws CommentException {
        Comment replyTo = getComment(replyToId);
        Comment reply = createNewCommentEntity(replyTo.getPost(), newReply);
        Comment parent = replyTo.getParent() == null ? replyTo : replyTo.getParent();
        reply.setReplyTo(replyTo);
        reply.setParent(parent);
        Comment savedReply = commentRepository.save(reply);
        Notification notification = addReplyNotificationBuilder.build(savedReply);
        notificationSender.send(notification, replyTo.getUser());

        return savedReply;
    }

    private Comment createNewCommentEntity(Post post, NewComment newComment)
            throws CommentException {
        Comment comment = new Comment();
        validateNewComment(newComment);

        comment.setUser(UserService.getUser());
        comment.setText(newComment.getText());
        comment.setMediaUrl(newComment.getMediaUrl());
        comment.setPost(post);
        comment.setMediaType(newComment.getMediaType());
        return comment;
    }

    private void validateNewComment(NewComment newComment) throws CommentException {
        String newCommentText = newComment.getText();
        String newCommentMediaUrl = newComment.getMediaUrl();

        if (newCommentText == null && newCommentMediaUrl == null) {
            throw new CommentException("Please provide either media or text");
        }
    }

    public Page<Comment> getChildrenComment(Long parentId, PageOptions options)
            throws AppException {
        SortType sortType = options.getSortType();
        Sort sortOptions = commentSortTypeToSortOptionBuilder.toSortOption(sortType);
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);

        return commentRepository.findChildrenComments(
                UserService.getUser(),
                parentId,
                pageable
        ).map(CommentWithDerivedFields::toComment);
    }

    public Page<Comment> getPostComments(Long postId, PageOptions options)
            throws AppException {
        SortType sortType = options.getSortType();
        Sort sortOptions = commentSortTypeToSortOptionBuilder.toSortOption(sortType);
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);

        return commentRepository.findParentComments(
                UserService.getUser(),
                postId,
                pageable
        ).map(CommentWithDerivedFields::toComment);
    }

    public Comment getComment(Long id) throws CommentException {
        return commentRepository.findById(UserService.getUser(), id)
                .orElseThrow(() -> new CommentException("Comment not found")).toComment();
    }

    /**
     * Read comment using write lock.
     */
    private Comment getCommentUsingLock(Long id) throws CommentException {
        return commentRepository.findWithLockById(id)
                .orElseThrow(() -> new CommentException("Comment not found"));

    }
}
