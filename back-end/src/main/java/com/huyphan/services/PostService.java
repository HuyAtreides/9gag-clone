package com.huyphan.services;

import com.huyphan.models.NewPost;
import com.huyphan.models.Notification;
import com.huyphan.models.PageOptions;
import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.models.builders.VotePostNotificationBuilder;
import com.huyphan.models.enums.SortType;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.models.exceptions.VoteableObjectException;
import com.huyphan.models.projections.PostWithDerivedFields;
import com.huyphan.repositories.PostRepository;
import com.huyphan.utils.AWSS3Util;
import com.huyphan.utils.sortoptionsconstructor.SortTypeToSortOptionBuilder;
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
    private SortTypeToSortOptionBuilder postSortTypeToSortOptionBuilder;

    @Autowired
    private AWSS3Util awss3Util;

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
        post.setUser(UserService.getUser());
        post.setSection(newPost.getSection());
        post.setMediaUrl(newPost.getMediaUrl());
        post.setMediaType(newPost.getMediaType());
        post.setTitle(newPost.getTitle());
        post.setTags(newPost.getTags());
        postRepository.save(post);
    }

    public Slice<Post> getAllPost(PageOptions options) throws AppException {
        SortType sortType = options.getSortType();
        Sort sortOptions = postSortTypeToSortOptionBuilder.toSortOption(SortType.USER_FAV_SECTIONS,
                sortType);
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);
        User user = UserService.getUser();
        Slice<PostWithDerivedFields> page = postRepository.findAll(
                user, getSearchTerm(options.getSearch()), pageable);
        return page.map(PostWithDerivedFields::toPost);
    }

    public Slice<Post> getAllPostsWithinSection(PageOptions options, String sectionName)
            throws AppException {
        SortType sortType = options.getSortType();
        Sort sortOptions = postSortTypeToSortOptionBuilder.toSortOption(sortType);

        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);

        return postRepository.findBySectionName(
                UserService.getUser(),
                sectionName,
                getSearchTerm(options.getSearch()),
                pageable).map(PostWithDerivedFields::toPost);
    }

    private String getSearchTerm(String search) {
        if (search == null || search.isBlank()) {
            return "\"\"";
        }

        return search;
    }

    @Transactional(rollbackFor = {VoteableObjectException.class, PostException.class})
    public void deletePost(Long id) throws PostException {
        User currentUser = UserService.getUser();
        Post post = getPost(id);

        if (!post.getUser().getUsername().equals(currentUser.getUsername())) {
            throw new PostException("Post not found");
        }

        awss3Util.deleteObject(post.getMediaUrl());
        postRepository.deleteById(id);
    }

    public Slice<Post> getSavedPosts(PageOptions options) {
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize());

        return postRepository.findSavedPost(UserService.getUser(), pageable)
                .map(PostWithDerivedFields::toPost);
    }

    public Slice<Post> getVotedPosts(PageOptions options) {
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize());

        return postRepository.findVotedPost(UserService.getUser(), pageable)
                .map(PostWithDerivedFields::toPost);
    }

    @Transactional(rollbackFor = {VoteableObjectException.class, PostException.class})
    public void upvotesPost(Long id) throws PostException, VoteableObjectException {
        Post post = getPostUsingLock(id);

        if (voteablePostManager.getDownvotedObjects().contains(post)) {
            unDownvotesPost(id);
        }

        voteablePostManager.addUpvotedObject(post);
        post.setUpvotes(post.getUpvotes() + 1);
        sendVotePostNotification(post);
    }

    private void sendVotePostNotification(Post post) {
        Notification notification = votePostNotificationBuilder.build(post);
        notificationSender.send(notification, post.getUser());
    }

    @Transactional(rollbackFor = {VoteableObjectException.class, PostException.class})
    public void unUpvotesPost(Long id) throws PostException {
        Post post = getPostUsingLock(id);
        boolean isRemoved = voteablePostManager.removeUpvotedObject(post);

        if (isRemoved) {
            post.setUpvotes(post.getUpvotes() - 1);
        }
    }

    @Transactional(rollbackFor = {VoteableObjectException.class, PostException.class})
    public void downvotesPost(Long id) throws PostException, VoteableObjectException {
        Post post = getPostUsingLock(id);

        if (voteablePostManager.getUpvotedObjects().contains(post)) {
            unUpvotesPost(id);
        }

        voteablePostManager.addDownVotedObject(post);
        post.setDownvotes(post.getDownvotes() + 1);
        sendVotePostNotification(post);
    }

    @Transactional(rollbackFor = {VoteableObjectException.class, PostException.class})
    public void unDownvotesPost(Long id) throws PostException {
        Post post = getPostUsingLock(id);
        boolean isRemoved = voteablePostManager.removeDownvotedObject(post);

        if (isRemoved) {
            post.setDownvotes(post.getDownvotes() - 1);
        }
    }

    public Post getPost(Long id) throws PostException {
        return postRepository.findByPostId(UserService.getUser(), id)
                .orElseThrow(() -> new PostException("Post not found")).toPost();
    }

    public Post getPostUsingLock(Long id) throws PostException {
        return postRepository.findWithLockById(id)
                .orElseThrow(() -> new PostException("Post not found"));
    }

    public void savePost(Long id) throws PostException {
        Post post = getPost(id);
        userService.savePost(post);
    }

    public void removeSavedPost(Long id) throws PostException {
        Post post = getPost(id);
        userService.removeSavedPost(post);
    }
}
