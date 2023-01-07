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
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
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
        post.setUser(UserService.getUser());
        post.setSection(newPost.getSection());
        post.setMediaUrl(newPost.getMediaUrl());
        post.setMediaType(newPost.getMediaType());
        post.setTitle(newPost.getTitle());
        post.setTags(newPost.getTags());
        postRepository.save(post);
    }

    public Slice<Post> getAllPost(PageOptions options, PostTag postTag) throws AppException {
        if (UserService.getUser().getFavoriteSections().isEmpty()) {
            return getAllPostWithoutUserFavSection(options, postTag);
        }

        Page<Post> pageOfPostsInUserFavSection = getAllPostsInUserFavSection(options, postTag);
        List<Post> postsInUserFavSection = pageOfPostsInUserFavSection.getContent();

        if (!postsInUserFavSection.isEmpty() && !pageOfPostsInUserFavSection.isLast()) {
            return pageOfPostsInUserFavSection;
        }

        Pageable pageableReturnedToClient = getPageableReturnedToClient(options,
                pageOfPostsInUserFavSection);
        PageOptions optionsToGetPostsNotInUserFavSection = getPostsNotInUserFavSectionPageOptions(
                options,
                pageOfPostsInUserFavSection
        );

        Slice<Post> postsNotInUserFavSections = getAllPostsNotInUserFavSection(
                optionsToGetPostsNotInUserFavSection,
                postTag);

        if (options.getPage() < pageOfPostsInUserFavSection.getTotalPages()) {
            return new SliceImpl<>(postsInUserFavSection, pageableReturnedToClient,
                    postsNotInUserFavSections.hasNext());
        }

        return new SliceImpl<>(postsNotInUserFavSections.getContent(), pageableReturnedToClient,
                postsNotInUserFavSections.hasNext());
    }

    private Pageable getPageableReturnedToClient(PageOptions options,
            Page<Post> pageOfPostsInUserFavSection) {
        int pageNumberReturnedToClient = getPageNumberReturnedToClient(options,
                pageOfPostsInUserFavSection);
        return PageRequest.of(pageNumberReturnedToClient,
                options.getSize());
    }

    private PageOptions getPostsNotInUserFavSectionPageOptions(PageOptions options,
            Page<Post> pageOfPostsInUserFavSection) {
        int pageNumberReturnedToClient = getPageNumberReturnedToClient(options,
                pageOfPostsInUserFavSection);

        return new PageOptions(
                pageNumberReturnedToClient - pageOfPostsInUserFavSection.getTotalPages(),
                options.getSize(),
                options.getSearch()
        );
    }

    private int getPageNumberReturnedToClient(PageOptions options,
            Page<Post> pageOfPostsInUserFavSection) {
        int totalPageOfPostsInUserFavSection = pageOfPostsInUserFavSection.getTotalPages();
        return Math.max(options.getPage(),
                totalPageOfPostsInUserFavSection);
    }

    public Page<Post> getAllPostsInUserFavSection(PageOptions options, PostTag postTag)
            throws AppException {
        User user = UserService.getUser();
        Sort sortOptions = sortOptionsConstructorFactory.getSortOptionConstructor(postTag)
                .constructSortOptions();
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);

        return postRepository.findAllPostInUserFavSection(
                user.getFavoriteSections(),
                getSearchTerm(options.getSearch()),
                pageable
        );
    }

    public Slice<Post> getAllPostWithoutUserFavSection(PageOptions options, PostTag postTag)
            throws AppException {
        Sort sortOptions = sortOptionsConstructorFactory.getSortOptionConstructor(postTag)
                .constructSortOptions();
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);

        return postRepository.findAll(getSearchTerm(options.getSearch()), pageable);
    }

    public Slice<Post> getAllPostsNotInUserFavSection(PageOptions options, PostTag postTag)
            throws AppException {
        User user = UserService.getUser();
        Sort sortOptions = sortOptionsConstructorFactory.getSortOptionConstructor(postTag)
                .constructSortOptions();
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);

        return postRepository.findAllPostNotInUserFavSection(
                user.getFavoriteSections(), getSearchTerm(options.getSearch()), pageable);
    }

    public Slice<Post> getAllPostsWithinSection(PageOptions options, PostTag postTag,
            String sectionName)
            throws AppException {
        Sort sortOptions = sortOptionsConstructorFactory.getSortOptionConstructor(postTag)
                .constructSortOptions();
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);

        return postRepository.findBySectionName(
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
    public void deletePost(Long id) throws PostException {
        User currentUser = UserService.getUser();
        Post post = getPost(id);

        if (!post.getUser().getUsername().equals(currentUser.getUsername())) {
            throw new PostException("Post not found");
        }

        postRepository.deleteById(id);
        userService.removeSavedPost(post);
        voteablePostManager.removeDownvotedObject(post);
        voteablePostManager.removeUpvotedObject(post);
    }

    public Slice<Post> getSavedPosts(PageOptions options) {
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize());

        return postRepository.findSavedPost(UserService.getUser(), pageable);
    }

    public Slice<Post> getVotedPosts(PageOptions options) {
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize());

        return postRepository.findVotedPost(UserService.getUser(), pageable);
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
        return postRepository.findById(id)
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
