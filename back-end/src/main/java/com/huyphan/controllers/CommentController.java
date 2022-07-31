package com.huyphan.controllers;

import com.huyphan.dtos.CommentDto;
import com.huyphan.dtos.PageDto;
import com.huyphan.dtos.PageOptionsDto;
import com.huyphan.mappers.CommentMapper;
import com.huyphan.mappers.PageMapper;
import com.huyphan.mappers.PageOptionMapper;
import com.huyphan.models.Comment;
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
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("{parentId}/children")
    public PageDto<CommentDto> getChildrenComment(@PathVariable Long parentId,
            @RequestParam PageOptionsDto optionsDto) {
        PageOptions pageOptions = pageOptionMapper.fromDto(optionsDto);
        Page<Comment> comments = commentService.getChildrenComment(parentId, pageOptions);

        return pageMapper.toDto(comments, commentMapper);
    }

    @PutMapping("upvotes/{id}")
    public void upvotesPost(@PathVariable Long id) throws PostException, CommentException {
        commentService.upvotesPost(id);
    }

    @PutMapping("downvotes/{id}")
    public void downvotesPost(@PathVariable Long id) throws PostException, CommentException {
        commentService.downvotesPost(id);
    }

    @PutMapping("unupvotes/{id}")
    public void unUpvotesPost(@PathVariable Long id) throws PostException, CommentException {
        commentService.unUpvotesPost(id);
    }

    @PutMapping("undownvotes/{id}")
    public void unDownvotesPost(@PathVariable Long id) throws PostException, CommentException {
        commentService.unDownvotesPost(id);
    }

    @GetMapping("{postId}")
    public PageDto<CommentDto> getPostComments(@PathVariable Long postId,
            PageOptionsDto optionsDto) {
        PageOptions pageOptions = pageOptionMapper.fromDto(optionsDto);
        Page<Comment> comments = commentService.getPostComments(postId, pageOptions);

        return pageMapper.toDto(comments, commentMapper);
    }

    @DeleteMapping("{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }

    @PutMapping
    public void updateComment(@RequestBody CommentDto newCommentDto) {
        Comment newComment = commentMapper.fromDto(newCommentDto);
        commentService.updateComment(newComment);
    }

    @PostMapping("{postId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addComment(@PathVariable Long postId, @RequestBody CommentDto commentDto)
            throws PostException {
        Comment comment = commentMapper.fromDto(commentDto);
        commentService.addComment(postId, comment);
    }

    @PostMapping("{postId}/{parentCommentId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addReply(@PathVariable Long postId, @PathVariable Long parentCommentId,
            @RequestBody CommentDto replyDto)
            throws CommentException, PostException {
        Comment reply = commentMapper.fromDto(replyDto);
        commentService.addReply(postId, reply, parentCommentId);
    }

    @ExceptionHandler({PostException.class, CommentException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppException handleExceptions(AppException exception) {
        return exception;
    }

}
