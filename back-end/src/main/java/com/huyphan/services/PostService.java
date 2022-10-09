package com.huyphan.services;

import com.huyphan.models.NewPost;
import com.huyphan.models.Notification;
import com.huyphan.models.PageOptions;
import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.models.builders.VotePostNotificationBuilder;
import com.huyphan.models.enums.PostTag;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.models.exceptions.VoteableObjectException;
import com.huyphan.repositories.PostRepository;
import com.huyphan.utils.sortoptionsconstructor.SortOptionsConstructorFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private SortOptionsConstructorFactory sortOptionsConstructorFactory;

    @Autowired
    private VoteableObjectManager<Post> voteablePostManager;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationSender notificationSender;

    @Autowired
    private VotePostNotificationBuilder votePostNotificationBuilder;

    public void addNewPost(NewPost newPost) {
        Post post = new Post();
        post.setUser(userService.getUser());
        post.setSection(newPost.getSection());
        post.setMediaUrl(newPost.getMediaUrl());
        post.setMediaType(newPost.getMediaType());
        post.setTitle(newPost.getTitle());
        post.setTags(newPost.getTags());
        postRepository.save(post);
    }

    public Slice<Post> getAllPost(PageOptions options, PostTag postTag) throws AppException {
        Sort sortOptions = sortOptionsConstructorFactory.getSortOptionConstructor(postTag)
                .constructSortOptions();
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);
        Long userId = getCurrentUserId();

        return postRepository.findAll(userId, getSearchTerm(options.getSearch()), pageable);
    }

    private Long getCurrentUserId() {
        try {
            User user = userService.getUser();

            return user.getId();
        } catch (Exception exception) {
            return -1L;
        }
    }

    public Slice<Post> getAllPostsWithinSection(PageOptions options, PostTag postTag,
            String sectionName)
            throws AppException {
        Sort sortOptions = sortOptionsConstructorFactory.getSortOptionConstructor(postTag)
                .constructSortOptions();
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);

        return postRepository.findBySectionName(getCurrentUserId(),
                sectionName,
                getSearchTerm(options.getSearch()),
                pageable);
    }

    private String getSearchTerm(String search) {
        if (search == null || search.isBlank()) {
            return "\"\"";
        }

        return search;
    }

    @Transactional(rollbackFor = {VoteableObjectException.class, PostException.class})
    public void deletePost(Long id) throws PostException, VoteableObjectException {
        User currentUser = userService.getUser();
        Post post = getPost(id);

        if (!post.getUser().getUsername().equals(currentUser.getUsername())) {
            throw new PostException("Post not found");
        }

        postRepository.deleteById(id);
        userService.removeSavedPost(post);
        voteablePostManager.removeDownvotedObject(post);
        voteablePostManager.removeDownvotedObject(post);
    }

    public Slice<Post> getSavedPosts() {
        return postRepository.findSavedPost(getCurrentUserId());
    }

    public Slice<Post> getVotedPosts() {
        return postRepository.findVotedPost(getCurrentUserId());
    }

    @Transactional(rollbackFor = {VoteableObjectException.class, PostException.class})
    public void upvotesPost(Long id) throws PostException, VoteableObjectException {
        Post post = getPostUsingLock(id);
        voteablePostManager.addUpvotedObject(post);
        post.setUpvotes(post.getUpvotes() + 1);
        sendVotePostNotification(post);
    }

    private void sendVotePostNotification(Post post) {
        Notification notification = votePostNotificationBuilder.build(post);
        notificationSender.send(notification, post.getUser());
    }

    @Transactional(rollbackFor = {VoteableObjectException.class, PostException.class})
    public void unUpvotesPost(Long id) throws PostException, VoteableObjectException {
        Post post = getPostUsingLock(id);
        voteablePostManager.removeUpvotedObject(post);
        post.setUpvotes(post.getUpvotes() - 1);
    }


    @Transactional(rollbackFor = {VoteableObjectException.class, PostException.class})
    public void downvotesPost(Long id) throws PostException, VoteableObjectException {
        Post post = getPostUsingLock(id);
        post.setDownvotes(post.getDownvotes() + 1);
        voteablePostManager.addDownVotedObject(post);
        sendVotePostNotification(post);
    }

    @Transactional(rollbackFor = {VoteableObjectException.class, PostException.class})
    public void unDownvotesPost(Long id) throws PostException, VoteableObjectException {
        Post post = getPostUsingLock(id);
        voteablePostManager.removeDownvotedObject(post);
        post.setDownvotes(post.getDownvotes() - 1);
    }

    public Post getPost(Long id) throws PostException {
        return postRepository.findById(getCurrentUserId(), id)
                .orElseThrow(() -> new PostException("Post not found"));
    }

    public Post getPostUsingLock(Long id) throws PostException {
        return postRepository.findWithLockById(id)
                .orElseThrow(() -> new PostException("Post not found"));
    }

    public void savePost(Post post) {
        userService.savePost(post);
    }

    public void removeSavedPost(Post post) {
        userService.removeSavedPost(post);
    }
}
