package com.huyphan.services;

import com.huyphan.events.AddPostEvent;
import com.huyphan.events.DeletePostEvent;
import com.huyphan.events.SharePostEvent;
import com.huyphan.events.VotePostEvent;
import com.huyphan.mediators.IMediator;
import com.huyphan.mediators.MediatorComponent;
import com.huyphan.models.Comment;
import com.huyphan.models.NewPost;
import com.huyphan.models.PageOptions;
import com.huyphan.models.Post;
import com.huyphan.models.SharePostRequest;
import com.huyphan.models.SharedPost;
import com.huyphan.models.User;
import com.huyphan.models.enums.PostContentType;
import com.huyphan.models.enums.SortType;
import com.huyphan.models.enums.SupportedMIMEType;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.models.exceptions.UploadException;
import com.huyphan.models.projections.PostWithDerivedFields;
import com.huyphan.repositories.PostRepository;
import com.huyphan.services.followactioninvoker.IFollowActionInvoker;
import com.huyphan.services.togglenotificationinvoker.IToggleNotificationInvoker;
import com.huyphan.utils.AWSS3Util;
import com.huyphan.utils.sortoptionsconstructor.SortTypeToSortOptionBuilder;
import java.util.Arrays;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Getter
@Setter
public class PostService implements MediatorComponent {

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
    private IFollowActionInvoker followActionInvoker;
    @Autowired
    private IToggleNotificationInvoker toggleNotificationInvoker;

    private IMediator mediator;

    @Transactional(rollbackFor = {AppException.class})
    public void addNewPost(NewPost newPost) throws AppException {
        Post post = new Post();
        PostContentType contentType = newPost.getContentType();
        String mediaUrl = newPost.getMediaUrl();
        String mediaType = newPost.getMediaType();

        if (contentType == PostContentType.MEDIA && (mediaType == null || mediaUrl == null)) {
            throw new PostException(
                    "Media type and media url must be present when post content type is MEDIA");
        }

        if (Arrays.stream(SupportedMIMEType.values())
                .noneMatch(supportedMIMEType -> supportedMIMEType.getValue().equals(mediaType))) {
            awss3Util.deleteObject(mediaUrl);
            throw new PostException("Unsupported file type");
        }

        post.setUser(userService.getCurrentUser());
        post.setSection(newPost.getSection());
        post.setMediaUrl(mediaUrl);
        post.setMediaType(mediaType);
        post.setTitle(newPost.getTitle());
        post.setTags(newPost.getTags());
        post.setContentType(contentType);
        post.setText(newPost.getText());
        post.setNotificationEnabled(newPost.isNotificationEnabled());
        post.setAnonymous(newPost.isAnonymous());
        Post savedPost = postRepository.save(post);
        mediator.notify(new AddPostEvent(savedPost));
    }

    @Transactional(rollbackFor = {AppException.class})
    public void sharePost(SharePostRequest request) throws AppException {
        Long sharedPostId = request.getSharedPostId();
        Post sharedPost = getPostWithoutDerivedFields(sharedPostId);
        boolean sharedPostContainsAnotherSharedPost = sharedPost.getSharedPostId() != null;

        if (sharedPostContainsAnotherSharedPost) {
            sharedPostId = sharedPost.getSharedPostId();
        }

        Post post = new Post();
        post.setUser(userService.getCurrentUser());
        post.setContentType(PostContentType.SHARED_POST);
        post.setAnonymous(false);
        post.setNotificationEnabled(true);
        post.setSharedPostId(sharedPostId);
        post.setTitle(request.getTitle());
        post.setSection(request.getSection());
        Post sharedPostContainer = postRepository.save(post);
        mediator.notify(
                new SharePostEvent(
                        sharedPostContainer.getId(),
                        sharedPost.getOwner()
                )
        );

    }

    public SharedPost findSharedPost(long postIdContainsSharedPost) throws PostException {
        Post postContainsSharedPost = getPostWithoutDerivedFields(postIdContainsSharedPost);
        Long sharedPostId = postContainsSharedPost.getSharedPostId();

        if (sharedPostId == null) {
            throw new PostException("Shared post not found");
        }

        User sharingUser = postContainsSharedPost.getOwner();

        boolean sharingUserCanAccessSharedPost = postRepository.canUserAccessPost(
                sharingUser,
                sharedPostId
        );

        if (!sharingUserCanAccessSharedPost) {
            throw new PostException("Shared post not found");
        }

        return getPostWithoutDerivedFields(sharedPostId);
    }

    @Transactional(rollbackFor = {AppException.class})
    public void setAnonymous(Long id, boolean value) throws PostException {
        Post post = getPostWithoutDerivedFields(id);

        if (!post.getOwner().equals(UserService.getUser())) {
            throw new PostException("Post not found");
        }

        post.setAnonymous(value);
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

    @Transactional(rollbackFor = {AppException.class})
    public void followPost(Long id) throws AppException {
        Post post = getPostWithoutDerivedFields(id);
        followActionInvoker.follow(post);
    }

    @Transactional(rollbackFor = {AppException.class})
    public void unFollowPost(Long id) throws AppException {
        Post post = getPostWithoutDerivedFields(id);
        followActionInvoker.unFollow(post);
    }

    public Slice<Post> getFollowingPost(Long userId, PageOptions options) throws AppException {
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize());
        User user = userService.getUserById(userId);
        User currentUser = UserService.getUser();
        String searchTerm = getSearchTerm(options.getSearch());

        if (!user.equals(currentUser) && user.getIsPrivate() && !user.isFollowed()) {
            throw new AppException("User profile is private. Follow to view this user profile!");
        }

        return postRepository.findFollowingPost(
                user,
                currentUser,
                searchTerm,
                pageable
        ).map(PostWithDerivedFields::toPost);
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

        return "\"" + "*" + search + "*" + "\"";
    }

    @Transactional(rollbackFor = {AppException.class})
    public void deletePost(Long id) throws AppException {
        User currentUser = UserService.getUser();
        Post post = getPostWithoutDerivedFields(id);

        if (!post.getUser().getUsername().equals(currentUser.getUsername())) {
            throw new PostException("Post not found");
        }

        mediator.notify(new DeletePostEvent(id));
        postRepository.deleteById(id);
        awss3Util.deleteObject(post.getMediaUrl());
    }

    @Transactional(rollbackFor = {AppException.class})
    public void addNewComment(Long postId, Comment comment) throws PostException {
        comment.setPost(getPostWithoutDerivedFields(postId));
    }

    @Transactional(rollbackFor = {AppException.class})
    public void toggleNotification(Long id, boolean value) throws AppException {
        Post post = getPostWithoutDerivedFields(id);
        toggleNotificationInvoker.toggle(post, value);
    }

    public Slice<Post> getSavedPosts(Long userId, PageOptions options) throws AppException {
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize());
        User user = userService.getUserById(userId);
        User currentUser = UserService.getUser();

        if (!user.equals(currentUser) && user.getIsPrivate() && !user.isFollowed()) {
            throw new AppException("User profile is private. Follow to view this user profile!");
        }

        String searchTerm = getSearchTerm(options.getSearch());
        return postRepository.findSavedPost(
                        user,
                        currentUser,
                        searchTerm,
                        pageable
                )
                .map(PostWithDerivedFields::toPost);
    }

    public Slice<Post> getVotedPosts(Long userId, PageOptions options) throws AppException {
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize());
        User user = userService.getUserById(userId);
        User currentUser = UserService.getUser();
        String searchTerm = getSearchTerm(options.getSearch());

        if (!user.equals(currentUser) && user.getIsPrivate() && !user.isFollowed()) {
            throw new AppException("User profile is private. Follow to view this user profile!");
        }

        return postRepository.findVotedPost(
                        user,
                        currentUser,
                        searchTerm,
                        pageable
                )
                .map(PostWithDerivedFields::toPost);
    }

    public Slice<Post> getUserPosts(Long userId, PageOptions options) throws AppException {
        Sort sortOptions = postSortTypeToSortOptionBuilder.toSortOption(SortType.FRESH);
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sortOptions);
        User user = userService.getUserById(userId);
        User currentUser = UserService.getUser();
        String searchTerm = getSearchTerm(options.getSearch());

        if (!user.equals(currentUser) && user.getIsPrivate() && !user.isFollowed()) {
            throw new AppException("User profile is private. Follow to view this user profile!");
        }

        return postRepository.findUserPost(
                        user,
                        currentUser,
                        searchTerm,
                        pageable
                )
                .map(PostWithDerivedFields::toPost);
    }

    @Transactional(rollbackFor = {AppException.class})
    public void upvotesPost(Long id) throws AppException {
        Post post = getPostUsingLock(id);

        if (voteablePostManager.getDownvotedObjects().contains(post)) {
            unDownvotesPost(id);
        }

        voteablePostManager.addUpvotedObject(post);
        post.setUpvotes(post.getUpvotes() + 1);
        mediator.notify(new VotePostEvent(post));
    }

    @Transactional(rollbackFor = {AppException.class})
    public void unUpvotesPost(Long id) throws PostException {
        Post post = getPostUsingLock(id);
        boolean isRemoved = voteablePostManager.removeUpvotedObject(post);

        if (isRemoved) {
            post.setUpvotes(post.getUpvotes() - 1);
        }
    }

    @Transactional(rollbackFor = {AppException.class})
    public void downvotesPost(Long id) throws AppException {
        Post post = getPostUsingLock(id);

        if (voteablePostManager.getUpvotedObjects().contains(post)) {
            unUpvotesPost(id);
        }

        voteablePostManager.addDownVotedObject(post);
        post.setDownvotes(post.getDownvotes() + 1);
        mediator.notify(new VotePostEvent(post));
    }

    @Transactional(rollbackFor = {AppException.class})
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

    public Post getPostWithoutDerivedFields(Long id) throws PostException {
        return postRepository.findById(id, UserService.getUser())
                .orElseThrow(() -> new PostException("Post not found"));
    }

    public Post getPostUsingLock(Long id) throws PostException {
        return postRepository.findWithLockById(id, UserService.getUser())
                .orElseThrow(() -> new PostException("Post not found"));
    }

    @Transactional(rollbackFor = {AppException.class})
    public void savePost(Long id) throws PostException {
        Post post = getPostWithoutDerivedFields(id);
        post.getSaveUsers().add(UserService.getUser());
    }

    @Transactional(rollbackFor = {AppException.class})
    public void removeSavedPost(Long id) throws PostException {
        Post post = getPost(id);
        post.getSaveUsers().remove(UserService.getUser());
    }
}
