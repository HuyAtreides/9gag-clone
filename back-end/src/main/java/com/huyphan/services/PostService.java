package com.huyphan.services;

import com.huyphan.models.PageOptions;
import com.huyphan.models.Post;
import com.huyphan.models.enums.PostTag;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.repositories.PostRepository;
import com.huyphan.utils.SortOptionsConstructor.SortOptionsConstructorFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private SortOptionsConstructorFactory sortOptionsConstructorFactory;

    @Autowired
    private UserService userService;

    public void addNewPost(Post newPost) {
        newPost.setUser(userService.getUser());
        postRepository.save(newPost);
    }

    public Slice<Post> getAllPost(PageOptions options, PostTag postTag) throws AppException {
        Sort sortOptions = sortOptionsConstructorFactory.getSortOptionConstructor(postTag)
                .constructSortOptions();
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);
        return postRepository.findAll(pageable);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void upvotesPost(Long id) throws PostException {
        Post post = getPost(id);
        post.setUpvotes(post.getUpvotes() + 1);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void unUpvotesPost(Long id) throws PostException {
        Post post = getPost(id);
        post.setUpvotes(post.getUpvotes() - 1);
    }


    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void downvotesPost(Long id) throws PostException {
        Post post = getPost(id);
        post.setDownvotes(post.getDownvotes() + 1);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void unDownvotesPost(Long id) throws PostException {
        Post post = getPost(id);
        post.setDownvotes(post.getDownvotes() - 1);
    }

    public Post getPost(Long id) throws PostException {
        return postRepository.findById(id).orElseThrow(() -> new PostException("Post not found"));
    }
}
