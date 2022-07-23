package com.huyphan.controllers;

import com.huyphan.dtos.PageDto;
import com.huyphan.dtos.PageOptionsDto;
import com.huyphan.dtos.PostDto;
import com.huyphan.mappers.PageMapper;
import com.huyphan.mappers.PageOptionMapper;
import com.huyphan.mappers.PostMapper;
import com.huyphan.models.PageOptions;
import com.huyphan.models.Post;
import com.huyphan.models.enums.PostTag;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.repositories.PostRepository;
import com.huyphan.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("posts")
public class PostController {

    @Autowired
    private PostMapper postMapper;
    @Autowired
    private PostService postService;
    @Autowired
    private PageOptionMapper pageOptionMapper;
    @Autowired
    private PageMapper<PostDto, Post> pageMapper;
    @Autowired
    private PostRepository postRepository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addNewPost(@RequestBody PostDto newPostDto) {
        Post newPost = postMapper.fromDto(newPostDto);
        postService.addNewPost(newPost);
    }

    @GetMapping("tag/:postTag")
    public PageDto<PostDto> getPosts(@PathVariable PostTag postTag,
            @RequestParam PageOptionsDto pageOptionsDto) throws AppException {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Page<Post> page = postService.getAllPost(pageOptions, postTag);
        return pageMapper.toDto(page);
    }

    @GetMapping()
    public Post getPost() {
        postRepository.findByUserId(1L);
        return null;
    }


}
