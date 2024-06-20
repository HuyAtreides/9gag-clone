package com.huyphan.services;

import com.huyphan.controllers.eventemitter.EventEmitter;
import com.huyphan.events.FollowEvent;
import com.huyphan.mediators.IMediator;
import com.huyphan.mediators.MediatorComponent;
import com.huyphan.models.PageOptions;
import com.huyphan.models.RegisterData;
import com.huyphan.models.Report;
import com.huyphan.models.ReportUserRequest;
import com.huyphan.models.UpdatePasswordData;
import com.huyphan.models.UpdateProfileData;
import com.huyphan.models.User;
import com.huyphan.models.UserSecret;
import com.huyphan.models.UserStats;
import com.huyphan.models.enums.WebSocketEvent;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.UserAlreadyExistsException;
import com.huyphan.models.exceptions.UserException;
import com.huyphan.models.projections.UserWithDerivedFields;
import com.huyphan.repositories.ReportRepository;
import com.huyphan.repositories.UserRepository;
import com.huyphan.services.followactioninvoker.IFollowActionInvoker;
import com.huyphan.utils.AWSS3Util;
import com.huyphan.utils.JwtUtil;
import java.time.Instant;
import java.util.Objects;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserDetailsService, MediatorComponent {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.default-avatar-url}")
    private String defaultAvatarUrl;

    @Value("${app.default-cover-image-url}")
    private String defaultCoverImgUrl;

    @Autowired
    private IFollowActionInvoker followActionInvoker;

    @Autowired
    private AWSS3Util awss3Util;

    @Autowired
    private EventEmitter eventEmitter;

    @Autowired
    private JwtUtil jwtUtil;

    @Setter
    private IMediator mediator;

    @Autowired
    private ReportRepository reportRepository;

    /**
     * Get current authenticated user.
     */
    static public User getUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Object principal = securityContext.getAuthentication().getPrincipal();

        if (!(principal instanceof UserDetails)) {
            return null;
        }

        return (User) principal;
    }

    public User getCurrentUser() {
        User user = getUser();
        assert user != null;
        return userRepo.save(user);
    }

    @Transactional
    public void reportUser(ReportUserRequest request) throws UserException {
        User user = findUserByIdWithoutBlockFilter(request.getUserId());

        Report report = Report.builder()
                .user(user)
                .owner(getCurrentUser())
                .createdAt(Instant.now())
                .reason(request.getReason())
                .build();
        reportRepository.save(report);
    }

    @Transactional
    public void suspendUser(long userId) throws UserException {
        User user = findUserByIdWithoutBlockFilter(userId);
        user.setSuspended(true);
        user.setSuspendedAt(Instant.now());
    }

    @Transactional
    public void unSuspendUser(long userId) throws UserException {
        User user = findUserByIdWithoutBlockFilter(userId);
        user.setSuspended(false);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username is not found"));
    }

    public UserStats getUserStats(long userId) throws UserException {
        User user = getUserWithoutDerivedFieldsById(userId);
        return userRepo.getUserStats(user, getUser());
    }

    @Transactional(rollbackFor = {UserException.class})
    public UserSecret updateProfile(UpdateProfileData updateProfileData)
            throws UserException {
        User user = getCurrentUser();
        String updatedUsername = updateProfileData.getUsername();
        String updatedAvatarUrl = updateProfileData.getAvatarUrl();
        String updatedCoverImgUrl = updateProfileData.getCoverImgUrl();
        String updatedAbout = updateProfileData.getAbout();

        if (!Objects.equals(user.getUsername(), updatedUsername) && userRepo.existsByUsername(
                updatedUsername)) {
            throw new UserException("Username is taken");
        }

        String oldAvatarUrl = user.getAvatarUrl();
        String oldCoverImgUrl = user.getCoverImageUrl();
        user.setUsername(updateProfileData.getUsername());
        user.setDisplayName(updateProfileData.getDisplayName());
        user.setAvatarUrl(updateProfileData.getAvatarUrl());
        user.setCountry(updateProfileData.getCountry());
        user.setCoverImageUrl(updatedCoverImgUrl);
        user.setAbout(updatedAbout == null ? "" : updatedAbout);
        user.setPrivate(updateProfileData.isPrivate());
        user.setOnlyReceiveMessageFromFollowers(
                updateProfileData.isOnlyReceiveMessageFromFollowers()
        );

        if (!updatedAvatarUrl.equals(oldAvatarUrl) && !Objects.equals(oldAvatarUrl,
                defaultAvatarUrl)) {
            awss3Util.deleteObject(oldAvatarUrl);
        }

        if (!updatedCoverImgUrl.equals(oldCoverImgUrl) && !Objects.equals(oldCoverImgUrl,
                defaultCoverImgUrl)) {
            awss3Util.deleteObject(oldCoverImgUrl);
        }

        return new UserSecret(jwtUtil.generateToken(user));
    }

    public Slice<User> searchUser(PageOptions pageOptions) {
        String searchTerm = getSearchTerm(pageOptions.getSearch());
        Pageable pageable = PageRequest.of(pageOptions.getPage(), pageOptions.getSize());

        return userRepo.searchUser(searchTerm, getUser(), pageable);
    }

    public Slice<User> getRecentSearch(PageOptions pageOptions) {
        Pageable pageable = PageRequest.of(pageOptions.getPage(), pageOptions.getSize());

        return userRepo.getRecentSearch(getUser(), pageable);
    }

    @Transactional(rollbackFor = {AppException.class})
    public void addToRecentSearch(Long userId) throws UserException {
        User user = getCurrentUser();
        User recentSearchUser = getUserWithoutDerivedFieldsById(userId);
        user.getRecentSearch().add(recentSearchUser);
    }

    @Transactional(rollbackFor = {AppException.class})
    public void deleteRecentSearch(Long userId) throws UserException {
        User user = getCurrentUser();
        User recentSearchUser = getUserWithoutDerivedFieldsById(userId);
        user.getRecentSearch().remove(recentSearchUser);
    }

    public Page<User> getAllUsers(PageOptions pageOptions) {
        String searchTerm = getSearchTerm(pageOptions.getSearch());
        Pageable pageable = PageRequest.of(pageOptions.getPage(), pageOptions.getSize());

        return userRepo.findAll(searchTerm, pageable);
    }

    private String getSearchTerm(String search) {
        if (search == null || search.isBlank()) {
            return "\"\"";
        }

        return "%" + search.toLowerCase() + "%";
    }

    @Transactional(rollbackFor = {UserException.class})
    public void updatePassword(UpdatePasswordData updatePasswordData) throws UserException {
        User user = getCurrentUser();
        String currentPassword = updatePasswordData.getCurrentPassword();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new UserException("Password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(updatePasswordData.getNewPassword()));
    }

    @Transactional(rollbackFor = {AppException.class})
    public void block(Long userId) throws UserException {
        User blockedUser = getUserWithoutDerivedFieldsById(userId);
        User user = getCurrentUser();

        if (blockedUser.equals(user)) {
            throw new UserException("You can not block yourself");
        }

        user.getBlocking().add(blockedUser);
        eventEmitter.emitEventTo(WebSocketEvent.BLOCK_USER, blockedUser);
    }

    @Transactional(rollbackFor = {AppException.class})
    public void unblock(Long userId) throws UserException {
        User user = getCurrentUser();
        User blockedUser = userRepo.findById(userId)
                .orElseThrow(() -> new UserException("User not found"));
        user.getBlocking().remove(blockedUser);
        eventEmitter.emitEventTo(WebSocketEvent.BLOCK_USER, blockedUser);
    }

    public Slice<User> getBlockingUser(PageOptions pageOptions) {
        Pageable pageable = PageRequest.of(pageOptions.getPage(), pageOptions.getSize(),
                JpaSort.unsafe(
                        Direction.DESC
                        ,
                        "(blockedTime)")
        );
        Slice<UserWithDerivedFields> slice = userRepo.getBlockedUsers(getUser(), pageable);

        return slice.map(UserWithDerivedFields::toUser);
    }

    public Slice<User> getRestrictedUser(PageOptions pageOptions) {
        Pageable pageable = PageRequest.of(pageOptions.getPage(), pageOptions.getSize(),
                JpaSort.unsafe(
                        Direction.DESC
                        ,
                        "(restrictedAt)")
        );
        Slice<UserWithDerivedFields> slice = userRepo.getRestrictedUser(getUser(), pageable);

        return slice.map(UserWithDerivedFields::toUser);
    }

    public User register(RegisterData registerData) throws UserAlreadyExistsException {
        User newUser = new User();
        String username = registerData.getUsername();
        String encodedPassword = passwordEncoder.encode(registerData.getPassword());
        newUser.setUsername(username);
        newUser.setDisplayName(registerData.getDisplayName());
        newUser.setCountry(registerData.getCountry());
        newUser.setPassword(encodedPassword);

        if (userRepo.existsByUsername(username)) {
            throw new UserAlreadyExistsException("Username is taken");
        }

        return userRepo.save(newUser);
    }

    @Transactional
    public void followUser(Long userId) throws AppException {
        User user = getUserWithoutDerivedFieldsById(userId);

        if (user.getIsPrivate()) {
            throw new AppException("This user profile is private. Please send follow request.");
        }

        followActionInvoker.follow(user);
        mediator.notify(new FollowEvent(user));
    }

    @Transactional
    public void unFollowUser(Long userId) throws UserException {
        User user = getUserWithoutDerivedFieldsById(userId);
        followActionInvoker.unFollow(user);
    }

    @Transactional
    public void removeFollower(Long followerId) {
        User user = getCurrentUser();
        boolean removed = user.getFollowers().removeIf(follower -> Objects.equals(follower.getId(),
                followerId));
    }

    public Slice<User> getUserFollowers(PageOptions options, Long id) throws AppException {
        User user = getUserById(id);
        User currentUser = UserService.getUser();
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), JpaSort.unsafe(
                Direction.DESC
                ,
                "(isFollowedByCurrentUser)"
        ));

        if (!user.equals(currentUser) && user.getIsPrivate() && !user.isFollowed()) {
            throw new AppException("User profile is private. Follow to view this user profile!");
        }

        return userRepo.getUserFollowers(user, currentUser, pageable).map(
                UserWithDerivedFields::toUser
        );
    }

    public Slice<User> getUserFollowing(PageOptions options, Long id) throws AppException {
        User user = getUserById(id);
        User currentUser = UserService.getUser();
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), JpaSort.unsafe(
                Direction.DESC
                ,
                "(isFollowedByCurrentUser)"
        ));

        if (!user.equals(currentUser) && user.getIsPrivate() && !user.isFollowed()) {
            throw new AppException("User profile is private. Follow to view this user profile!");
        }

        return userRepo.getUserFollowing(user, currentUser, pageable).map(
                UserWithDerivedFields::toUser
        );
    }

    @Transactional
    public void restrict(Long userId) throws UserException {
        User currentUser = getCurrentUser();
        currentUser.restrict(getUserById(userId));
    }

    @Transactional
    public void unRestrict(Long userId) throws UserException {
        User currentUser = getCurrentUser();
        currentUser.unRestrict(getUserById(userId));
    }

    /**
     * Get a specific user using user's id.
     */
    public User getUserById(Long id) throws UserException {
        User currentUser = getUser();
        return userRepo.findByUserId(id, currentUser)
                .orElseThrow(() -> new UserException("User is not found"))
                .toUser();
    }

    public User getUserWithoutDerivedFieldsById(Long id) throws UserException {
        return userRepo.findById(id, getUser())
                .orElseThrow(() -> new UserException("User is not found"));
    }

    public User findUserByIdWithoutBlockFilter(Long id) throws UserException {
        return userRepo.findById(id).orElseThrow(() -> new UserException("User is not found"));
    }
}
