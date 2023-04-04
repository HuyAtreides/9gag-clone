package com.huyphan.services;

import com.huyphan.events.AddPostEvent;
import com.huyphan.events.DeletePostEvent;
import com.huyphan.events.VotePostEvent;
import com.huyphan.mediators.IMediator;
import com.huyphan.models.Comment;
import com.huyphan.models.NewPost;
import com.huyphan.models.PageOptions;
import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.models.enums.SortType;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.models.exceptions.UserException;
import com.huyphan.models.projections.PostWithDerivedFields;
import com.huyphan.repositories.PostRepository;
import com.huyphan.services.followactioninvoker.IFollowActionInvoker;
import com.huyphan.services.togglenotificationinvoker.IToggleNotificationInvoker;
import com.huyphan.utils.AWSS3Util;
import com.huyphan.utils.sortoptionsconstructor.SortTypeToSortOptionBuilder;
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
    private IFollowActionInvoker followActionInvoker;
    @Autowired
    private IToggleNotificationInvoker toggleNotificationInvoker;

    private IMediator mediator;

    @Transactional(rollbackFor = {AppException.class})
    public void addNewPost(NewPost newPost) throws AppException {
        Post post = new Post();
        post.setUser(userService.getCurrentUser());
        post.setSection(newPost.getSection());
        post.setMediaUrl(newPost.getMediaUrl());
        post.setMediaType(newPost.getMediaType());
        post.setTitle(newPost.getTitle());
        post.setTags(newPost.getTags());
        post.setNotificationEnabled(true);
        Post savedPost = postRepository.save(post);
        mediator.notify(new AddPostEvent(savedPost));
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

    @Transactional
    public void followPost(Long id) throws AppException {
        Post post = getPostWithoutDerivedFields(id);
        followActionInvoker.follow(post);
    }

    @Transactional
    public void unFollowPost(Long id) throws AppException {
        Post post = getPostWithoutDerivedFields(id);
        followActionInvoker.unFollow(post);
    }

    public Slice<Post> getFollowingPost(Long userId, PageOptions options) throws UserException {
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize());
        User user = userService.getUserById(userId);
        User currentUser = UserService.getUser();
        String searchTerm = getSearchTerm(options.getSearch());

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

        return search;
    }

    @Transactional(rollbackFor = {AppException.class})
    public void deletePost(Long id) throws AppException {
        User currentUser = UserService.getUser();
        Post post = getPostWithoutDerivedFields(id);

        if (!post.getUser().getUsername().equals(currentUser.getUsername())) {
            throw new PostException("Post not found");
        }

        awss3Util.deleteObject(post.getMediaUrl());
        mediator.notify(new DeletePostEvent(id));
        postRepository.deleteById(id);
    }

    @Transactional
    public void addNewComment(Long postId, Comment comment) throws PostException {
        comment.setPost(getPostWithoutDerivedFields(postId));
    }

    @Transactional
    public void toggleNotification(Long id, boolean value) throws AppException {
        Post post = getPostWithoutDerivedFields(id);
        toggleNotificationInvoker.toggle(post, value);
    }

    public Slice<Post> getSavedPosts(Long userId, PageOptions options) throws UserException {
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize());
        User user = userService.getUserById(userId);
        User currentUser = UserService.getUser();
        String searchTerm = getSearchTerm(options.getSearch());

        return postRepository.findSavedPost(
                        user,
                        currentUser,
                        searchTerm,
                        pageable
                )
                .map(PostWithDerivedFields::toPost);
    }

    public Slice<Post> getVotedPosts(Long userId, PageOptions options) throws UserException {
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize());
        User user = userService.getUserById(userId);
        User currentUser = UserService.getUser();
        String searchTerm = getSearchTerm(options.getSearch());

        return postRepository.findVotedPost(
                        user,
                        currentUser,
                        searchTerm,
                        pageable
                )
                .map(PostWithDerivedFields::toPost);
    }

    public Slice<Post> getUserPosts(Long userId, PageOptions options) throws UserException {
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize());
        User user = userService.getUserById(userId);
        User currentUser = UserService.getUser();
        String searchTerm = getSearchTerm(options.getSearch());

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
        return postRepository.findById(id)
                .orElseThrow(() -> new PostException("Post not found"));
    }

    public Post getPostUsingLock(Long id) throws PostException {
        return postRepository.findWithLockById(id)
                .orElseThrow(() -> new PostException("Post not found"));
    }

    public void savePost(Long id) throws PostException {
        Post post = getPost(id);
        post.getSaveUsers().add(UserService.getUser());
    }

    public void removeSavedPost(Long id) throws PostException {
        Post post = getPost(id);
        post.getSaveUsers().remove(UserService.getUser());
    }
}
