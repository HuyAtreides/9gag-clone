package com.huyphan.controllers;

import com.huyphan.dtos.CommentDto;
import com.huyphan.dtos.NewCommentDto;
import com.huyphan.dtos.PageDto;
import com.huyphan.dtos.PageOptionsDto;
import com.huyphan.mappers.CommentMapper;
import com.huyphan.mappers.NewCommentMapper;
import com.huyphan.mappers.PageMapper;
import com.huyphan.mappers.PageOptionMapper;
import com.huyphan.models.Comment;
import com.huyphan.models.NewComment;
import com.huyphan.models.PageOptions;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.CommentException;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.repositories.CommentRepository;
import com.huyphan.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    private CommentService commentService;

    @Autowired
    private NewCommentMapper newCommentMapper;

    @GetMapping("{parentId}/children")
    public PageDto<CommentDto> getChildrenComment(@PathVariable Long parentId,
            PageOptionsDto optionsDto) {
        PageOptions pageOptions = pageOptionMapper.fromDto(optionsDto);
        Page<Comment> comments = commentService.getChildrenComment(parentId, pageOptions);

        return pageMapper.toDto(comments, commentMapper);
    }

    @PutMapping("upvotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void upvotesComment(@PathVariable Long id) throws PostException, CommentException {
        commentService.upvotesComment(id);
    }

    @PutMapping("downvotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void downvotesComment(@PathVariable Long id) throws PostException, CommentException {
        commentService.downvotesComment(id);
    }

    @PutMapping("unupvotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unUpvotesComment(@PathVariable Long id) throws PostException, CommentException {
        commentService.unUpvotesComment(id);
    }

    @PutMapping("undownvotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unDownvotesComment(@PathVariable Long id) throws PostException, CommentException {
        commentService.unDownvotesComment(id);
    }

    @GetMapping("/post/{postId}")
    public PageDto<CommentDto> getPostComments(@PathVariable Long postId,
            PageOptionsDto optionsDto) {
        PageOptions pageOptions = pageOptionMapper.fromDto(optionsDto);
        Page<Comment> comments = commentService.getPostComments(postId,
                pageOptions);
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
        commentService.deleteComment(id);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateComment(@RequestBody CommentDto newCommentDto) throws CommentException {
        Comment newComment = commentMapper.fromDto(newCommentDto);
        commentService.updateComment(newComment);
    }

    @PostMapping("{postId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addComment(@PathVariable Long postId, @RequestBody NewCommentDto newCommentDto)
            throws PostException, CommentException {
        NewComment newComment = newCommentMapper.fromDto(newCommentDto);
        commentService.addComment(postId, newComment);
    }

    @PostMapping("{postId}/{parentCommentId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addReply(@PathVariable Long postId, @PathVariable Long parentCommentId,
            @RequestBody NewCommentDto newReplyDto)
            throws CommentException, PostException {
        NewComment newReply = newCommentMapper.fromDto(newReplyDto);
        commentService.addReply(postId, newReply, parentCommentId);
    }

    @ExceptionHandler({PostException.class, CommentException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppException handleExceptions(AppException exception) {
        return exception;
    }

}
