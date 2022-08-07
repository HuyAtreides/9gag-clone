package com.huyphan.controllers;

import com.huyphan.dtos.PageOptionsDto;
import com.huyphan.dtos.PostDto;
import com.huyphan.dtos.SliceDto;
import com.huyphan.mappers.PageOptionMapper;
import com.huyphan.mappers.PostMapper;
import com.huyphan.mappers.SliceMapper;
import com.huyphan.models.PageOptions;
import com.huyphan.models.Post;
import com.huyphan.models.enums.PostTag;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("post")
public class PostController {

    @Autowired
    private PostMapper postMapper;
    @Autowired
    private PostService postService;
    @Autowired
    private PageOptionMapper pageOptionMapper;
    @Autowired
    private SliceMapper<PostDto, Post> sliceMapper;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addNewPost(@RequestBody PostDto newPostDto) {
        Post newPost = postMapper.fromDto(newPostDto);
        postService.addNewPost(newPost);
    }

    @DeleteMapping("{id}")
    public void deletePost(@PathVariable Long id) throws PostException {
        postService.deletePost(id);
    }

    @GetMapping("tag/{postTag}")
    public SliceDto<PostDto> getPosts(@PathVariable PostTag postTag,
            PageOptionsDto pageOptionsDto) throws AppException {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<Post> page = postService.getAllPost(pageOptions, postTag);
        return sliceMapper.toDto(page, postMapper);
    }

    @GetMapping("{id}")
    public PostDto getPost(@PathVariable Long id) throws PostException {
        Post post = postService.getPost(id);
        return postMapper.toDto(post);
    }

    @PutMapping("upvotes/{id}")
    public void upvotesPost(@PathVariable Long id) throws PostException {
        postService.upvotesPost(id);
    }

    @PutMapping("downvotes/{id}")
    public void downvotesPost(@PathVariable Long id) throws PostException {
        postService.downvotesPost(id);
    }

    @PutMapping("unupvotes/{id}")
    public void unUpvotesPost(@PathVariable Long id) throws PostException {
        postService.unUpvotesPost(id);
    }

    @PutMapping("undownvotes/{id}")
    public void unDownvotesPost(@PathVariable Long id) throws PostException {
        postService.unDownvotesPost(id);
    }

    @ExceptionHandler(PostException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppException handleExceptions(PostException exception) {
        return exception;
    }
}
