package com.huyphan.controllers;

import com.huyphan.dtos.NewPostDto;
import com.huyphan.dtos.PageOptionsDto;
import com.huyphan.dtos.PostDto;
import com.huyphan.dtos.SliceDto;
import com.huyphan.mappers.NewPostMapper;
import com.huyphan.mappers.PageOptionMapper;
import com.huyphan.mappers.PostMapper;
import com.huyphan.mappers.SliceMapper;
import com.huyphan.models.NewPost;
import com.huyphan.models.PageOptions;
import com.huyphan.models.Post;
import com.huyphan.models.enums.PostTag;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.models.exceptions.VoteableObjectException;
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
    private NewPostMapper newPostMapper;
    @Autowired
    private SliceMapper<PostDto, Post> sliceMapper;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addNewPost(@RequestBody NewPostDto newPostDto) {
        NewPost newPost = newPostMapper.fromDto(newPostDto);
        postService.addNewPost(newPost);
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
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

    @GetMapping("tag/{postTag}/{sectionName}")
    public SliceDto<PostDto> getPostsWithinSection(@PathVariable PostTag postTag, @PathVariable
            String sectionName, PageOptionsDto pageOptionsDto) throws AppException {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<Post> page = postService.getAllPostsWithinSection(pageOptions, postTag, sectionName);
        return sliceMapper.toDto(page, postMapper);
    }

    @GetMapping("{id}")
    public PostDto getPost(@PathVariable Long id) throws PostException {
        Post post = postService.getPost(id);
        return postMapper.toDto(post);
    }

    @PutMapping("upvotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void upvotesPost(@PathVariable Long id)
            throws PostException, VoteableObjectException {
        postService.upvotesPost(id);
    }

    @PutMapping("downvotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void downvotesPost(@PathVariable Long id) throws PostException, VoteableObjectException {
        postService.downvotesPost(id);
    }

    @PutMapping("unupvotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unUpvotesPost(@PathVariable Long id) throws PostException {
        postService.unUpvotesPost(id);
    }

    @PutMapping("undownvotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unDownvotesPost(@PathVariable Long id)
            throws PostException {
        postService.unDownvotesPost(id);
    }

    @GetMapping("save")
    public SliceDto<PostDto> getSavedPosts(PageOptionsDto pageOptionsDto) {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<Post> savedPosts = postService.getSavedPosts(pageOptions);

        return sliceMapper.toDto(savedPosts, postMapper);
    }

    @GetMapping("vote")
    public SliceDto<PostDto> getVotedPosts(PageOptionsDto pageOptionsDto) {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<Post> votedPosts = postService.getVotedPosts(pageOptions);

        return sliceMapper.toDto(votedPosts, postMapper);
    }

    @PostMapping("save")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void savePost(@RequestBody PostDto postDto) {
        Post post = postMapper.fromDto(postDto);
        postService.savePost(post);
    }

    @DeleteMapping("save")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeSavedPost(PostDto postDto) {
        Post post = postMapper.fromDto(postDto);
        postService.removeSavedPost(post);
    }

    @ExceptionHandler(PostException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppException handleExceptions(PostException exception) {
        return exception;
    }
}
