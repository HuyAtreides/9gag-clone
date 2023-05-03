package com.huyphan.controllers;

import com.huyphan.dtos.CommentDto;
import com.huyphan.dtos.NewCommentDto;
import com.huyphan.dtos.PageDto;
import com.huyphan.dtos.PageOptionsDto;
import com.huyphan.dtos.SliceDto;
import com.huyphan.mappers.CommentMapper;
import com.huyphan.mappers.NewCommentMapper;
import com.huyphan.mappers.PageMapper;
import com.huyphan.mappers.PageOptionMapper;
import com.huyphan.mappers.SliceMapper;
import com.huyphan.models.Comment;
import com.huyphan.models.NewComment;
import com.huyphan.models.PageOptions;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.CommentException;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.models.exceptions.VoteableObjectException;
import com.huyphan.repositories.CommentRepository;
import com.huyphan.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("comment")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private CommentMapper commentMapper;
    @Autowired
    private PageOptionMapper pageOptionMapper;
    @Autowired
    private PageMapper<CommentDto, Comment> pageMapper;
    @Autowired
    private SliceMapper<CommentDto, Comment> sliceMapper;
    @Autowired
    private CommentService commentService;
    @Autowired
    private NewCommentMapper newCommentMapper;

    @GetMapping("{parentId}/children")
    public PageDto<CommentDto> getChildrenComment(@PathVariable Long parentId,
            PageOptionsDto optionsDto) throws AppException {
        PageOptions pageOptions = pageOptionMapper.fromDto(optionsDto);
        Page<Comment> comments = commentService.getChildrenComment(parentId, pageOptions);

        return pageMapper.toDto(comments, commentMapper);
    }

    @PutMapping("upvotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void upvotesComment(@PathVariable Long id)
            throws AppException {
        commentService.upvotesComment(id);
    }

    @PutMapping("downvotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void downvotesComment(@PathVariable Long id)
            throws AppException {
        commentService.downvotesComment(id);
    }

    @PutMapping("unupvotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unUpvotesComment(@PathVariable Long id)
            throws PostException, CommentException, VoteableObjectException {
        commentService.unUpvotesComment(id);
    }

    @PutMapping("undownvotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unDownvotesComment(@PathVariable Long id)
            throws PostException, CommentException, VoteableObjectException {
        commentService.unDownvotesComment(id);
    }

    @GetMapping("post/{postId}")
    public PageDto<CommentDto> getPostComments(@PathVariable Long postId,
            PageOptionsDto optionsDto) throws AppException {
        PageOptions pageOptions = pageOptionMapper.fromDto(optionsDto);
        Page<Comment> comments = commentService.getPostComments(postId, pageOptions);
        return pageMapper.toDto(comments, commentMapper);
    }

    @GetMapping("{id}")
    public CommentDto getComment(@PathVariable Long id) throws CommentException {
        Comment comment = commentService.getComment(id);
        return commentMapper.toDto(comment);
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@PathVariable Long id) throws CommentException {
        commentService.deleteCommentInBatch(id);
    }

    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateComment(@PathVariable Long id,
            @RequestBody NewCommentDto updatedCommentFieldsDto) throws CommentException {
        NewComment updatedCommentFields = newCommentMapper.fromDto(updatedCommentFieldsDto);
        commentService.updateComment(id, updatedCommentFields);
    }

    @PostMapping("/post/{postId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Long addComment(@PathVariable Long postId,
            @RequestBody NewCommentDto newCommentDto)
            throws AppException {
        NewComment newComment = newCommentMapper.fromDto(newCommentDto);
        Comment savedComment = commentService.addComment(postId, newComment);

        return savedComment.getId();
    }

    @PostMapping("replyTo/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public Long addReply(@PathVariable Long id,
            @RequestBody NewCommentDto newReplyDto)
            throws AppException {
        NewComment newReply = newCommentMapper.fromDto(newReplyDto);
        Comment savedReply = commentService.addReply(newReply, id);

        return savedReply.getId();
    }

    @GetMapping("user/{userId}")
    public SliceDto<CommentDto> getUserComments(@PathVariable Long userId,
            PageOptionsDto optionsDto) throws AppException {
        PageOptions pageOptions = pageOptionMapper.fromDto(optionsDto);
        Slice<Comment> comments = commentService.getUserComments(userId, pageOptions);

        return sliceMapper.toDto(comments, commentMapper);
    }

    @PutMapping("follow/{id}")
    public void followComment(@PathVariable Long id) throws CommentException {
        commentService.followComment(id);
    }

    @PutMapping("unfollow/{id}")
    public void unFollowComment(@PathVariable Long id) throws CommentException {
        commentService.unfollowComment(id);
    }

    @PutMapping("turn-off-notifications/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void turnOffNotifications(@PathVariable Long id) throws AppException {
        commentService.toggleNotification(id, false);
    }

    @PutMapping("turn-on-notifications/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void turnOnNotifications(@PathVariable Long id) throws AppException {
        commentService.toggleNotification(id, true);
    }

    @ExceptionHandler({AppException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppException handleExceptions(AppException exception) {
        return exception;
    }

}
