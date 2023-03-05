package com.huyphan.services;

import com.huyphan.events.AddReplyEvent;
import com.huyphan.events.AppEvent;
import com.huyphan.events.CreateCommentEvent;
import com.huyphan.events.VoteCommentEvent;
import com.huyphan.mediators.IMediator;
import com.huyphan.models.Comment;
import com.huyphan.models.NewComment;
import com.huyphan.models.PageOptions;
import com.huyphan.models.User;
import com.huyphan.models.enums.SortType;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.CommentException;
import com.huyphan.models.exceptions.VoteableObjectException;
import com.huyphan.models.projections.CommentWithDerivedFields;
import com.huyphan.repositories.CommentRepository;
import com.huyphan.utils.AWSS3Util;
import com.huyphan.utils.sortoptionsconstructor.SortTypeToSortOptionBuilder;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Getter
@Setter
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private UserService userService;

    private IMediator mediator;

    @Autowired
    private SortTypeToSortOptionBuilder commentSortTypeToSortOptionBuilder;

    @Autowired
    private VoteableObjectManager<Comment> voteableCommentManager;

    @Autowired
    private AWSS3Util awss3Util;

    @Transactional(rollbackFor = {AppException.class})
    public Comment addComment(Long postId, NewComment newComment)
            throws AppException {
        Comment comment = commentRepository.save(createNewCommentEntity(newComment));
        AppEvent createCommentEvent = new CreateCommentEvent(comment, postId);
        mediator.notify(createCommentEvent);
        return comment;
    }

    @Transactional(rollbackFor = {AppException.class})
    public void deleteComment(Long id) throws CommentException {
        User currentUser = UserService.getUser();
        Comment comment = getCommentWithoutDerivedFields(id);

        if (!comment.getUser().getUsername().equals(currentUser.getUsername())) {
            throw new CommentException("Comment not found");
        }

        awss3Util.deleteObject(comment.getMediaUrl());
        Set<Long> leafCommentIds = commentRepository.getLeafReplyIdsOfComment(id);

        while (!leafCommentIds.isEmpty()) {
            commentRepository.deleteComments(leafCommentIds);
            leafCommentIds = commentRepository.getLeafReplyIdsOfComment(id);
        }

        commentRepository.deleteById(id);
    }

    @Transactional(rollbackFor = {AppException.class})
    public void deleteCommentOfPosts(Long postId) {
        Set<Long> leafPostCommentIds = commentRepository.getLeafCommentIdsOfPost(postId);

        while (!leafPostCommentIds.isEmpty()) {
            commentRepository.deleteComments(leafPostCommentIds);
            leafPostCommentIds = commentRepository.getLeafCommentIdsOfPost(postId);
        }
    }

    @Transactional(rollbackFor = {AppException.class})
    public void upvotesComment(Long id) throws AppException {
        Comment comment = getCommentUsingLock(id);

        if (voteableCommentManager.getDownvotedObjects().contains(comment)) {
            unDownvotesComment(id);
        }

        voteableCommentManager.addUpvotedObject(comment);
        comment.setUpvotes(comment.getUpvotes() + 1);
        mediator.notify(new VoteCommentEvent(comment));
    }

    @Transactional(rollbackFor = {AppException.class})
    public void unUpvotesComment(Long id) throws CommentException, VoteableObjectException {
        Comment comment = getCommentUsingLock(id);
        boolean isRemoved = voteableCommentManager.removeUpvotedObject(comment);

        if (isRemoved) {
            comment.setUpvotes(comment.getUpvotes() - 1);
        }
    }

    @Transactional(rollbackFor = {AppException.class})
    public void downvotesComment(Long id) throws AppException {
        Comment comment = getCommentUsingLock(id);

        if (voteableCommentManager.getUpvotedObjects().contains(comment)) {
            unUpvotesComment(id);
        }

        voteableCommentManager.addDownVotedObject(comment);
        comment.setDownvotes(comment.getDownvotes() + 1);
        mediator.notify(new VoteCommentEvent(comment));
    }

    @Transactional(rollbackFor = {AppException.class})
    public void unDownvotesComment(Long id) throws CommentException, VoteableObjectException {
        Comment comment = getCommentUsingLock(id);
        boolean isRemoved = voteableCommentManager.removeDownvotedObject(comment);

        if (isRemoved) {
            comment.setDownvotes(comment.getDownvotes() - 1);
        }
    }

    @Transactional(rollbackFor = {AppException.class})
    public void updateComment(Long id, NewComment updatedCommentFields) throws CommentException {
        Comment comment = getCommentUsingLock(id);
        User currentUser = UserService.getUser();
        validateNewComment(updatedCommentFields);

        if (!comment.getUser().getUsername().equals(currentUser.getUsername())) {
            throw new CommentException("Comment not found");
        }

        comment.setText(updatedCommentFields.getText());
        comment.setMediaType(updatedCommentFields.getMediaType());
        comment.setMediaUrl(updatedCommentFields.getMediaUrl());
    }

    @Transactional(rollbackFor = {AppException.class})
    public Comment addReply(NewComment newReply, Long replyToId)
            throws AppException {
        Comment replyTo = getCommentWithoutDerivedFields(replyToId);
        Comment reply = createNewCommentEntity(newReply);
        Comment parent = replyTo.getParent() == null ? replyTo : replyTo.getParent();
        reply.setReplyTo(replyTo);
        reply.setParent(parent);
        reply.setPost(replyTo.getPost());
        Comment savedReply = commentRepository.save(reply);
        mediator.notify(new AddReplyEvent(savedReply));
        return savedReply;
    }

    private Comment createNewCommentEntity(NewComment newComment)
            throws CommentException {
        Comment comment = new Comment();
        validateNewComment(newComment);

        comment.setUser(UserService.getUser());
        comment.setText(newComment.getText());
        comment.setMediaUrl(newComment.getMediaUrl());
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

    private Comment getCommentWithoutDerivedFields(Long id) throws CommentException {
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
