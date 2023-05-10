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
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.models.exceptions.UserException;
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
    public void addNewPost(@RequestBody NewPostDto newPostDto) throws AppException {
        NewPost newPost = newPostMapper.fromDto(newPostDto);
        postService.addNewPost(newPost);
    }

    @PutMapping("turn-off-notifications/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void turnOffNotifications(@PathVariable Long id) throws AppException {
        postService.toggleNotification(id, false);
    }

    @PutMapping("turn-on-notifications/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void turnOnNotifications(@PathVariable Long id) throws AppException {
        postService.toggleNotification(id, true);
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long id) throws AppException {
        postService.deletePost(id);
    }

    @GetMapping
    public SliceDto<PostDto> getPosts(
            PageOptionsDto pageOptionsDto) throws AppException {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<Post> page = postService.getAllPost(pageOptions);
        return sliceMapper.toDto(page, postMapper);
    }

    @GetMapping("section/{sectionName}")
    public SliceDto<PostDto> getPostsWithinSection(@PathVariable
            String sectionName, PageOptionsDto pageOptionsDto) throws AppException {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<Post> page = postService.getAllPostsWithinSection(pageOptions, sectionName);
        return sliceMapper.toDto(page, postMapper);
    }

    @GetMapping("{id}")
    public PostDto getPost(@PathVariable Long id) throws PostException {
        Post post = postService.getPost(id);
        return postMapper.toDto(post);
    }

    @PutMapping("enable-anonymous/{id}")
    public void enableAnonymous(@PathVariable Long id) throws PostException {
        postService.setAnonymous(id , true);
    }

    @PutMapping("disable-anonymous/{id}")
    public void disableAnonymous(@PathVariable Long id) throws PostException {
        postService.setAnonymous(id, false);
    }
    @PutMapping("upvotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void upvotesPost(@PathVariable Long id)
            throws AppException {
        postService.upvotesPost(id);
    }

    @PutMapping("downvotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void downvotesPost(@PathVariable Long id) throws AppException {
        postService.downvotesPost(id);
    }

    @PutMapping("follow/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void followPost(@PathVariable Long id) throws AppException {
        postService.followPost(id);
    }

    @PutMapping("unfollow/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unFollowPost(@PathVariable Long id) throws AppException {
        postService.unFollowPost(id);
    }

    @GetMapping("following/{userId}")
    public SliceDto<PostDto> getFollowingPost(@PathVariable Long userId,
            PageOptionsDto pageOptionsDto)
            throws AppException {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<Post> page = postService.getFollowingPost(userId, pageOptions);
        return sliceMapper.toDto(page, postMapper);
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

    @GetMapping("save/{userId}")
    public SliceDto<PostDto> getSavedPosts(@PathVariable Long userId,
            PageOptionsDto pageOptionsDto) throws AppException {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<Post> savedPosts = postService.getSavedPosts(userId, pageOptions);

        return sliceMapper.toDto(savedPosts, postMapper);
    }

    @GetMapping("upvote/{userId}")
    public SliceDto<PostDto> getVotedPosts(@PathVariable Long userId,
            PageOptionsDto pageOptionsDto) throws AppException {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<Post> votedPosts = postService.getVotedPosts(userId, pageOptions);

        return sliceMapper.toDto(votedPosts, postMapper);
    }

    @GetMapping("user/{userId}")
    public SliceDto<PostDto> getUserPosts(@PathVariable Long userId,
            PageOptionsDto pageOptionsDto) throws AppException {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<Post> votedPosts = postService.getUserPosts(userId, pageOptions);

        return sliceMapper.toDto(votedPosts, postMapper);
    }

    @PutMapping("save/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void savePost(@PathVariable Long id) throws PostException {
        postService.savePost(id);
    }

    @DeleteMapping("save/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeSavedPost(@PathVariable Long id) throws PostException {
        postService.removeSavedPost(id);
    }

    @ExceptionHandler(AppException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppException handleExceptions(AppException exception) {
        return exception;
    }
}
