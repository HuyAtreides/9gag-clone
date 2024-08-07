package com.huyphan.controllers;

import com.huyphan.dtos.PageDto;
import com.huyphan.dtos.PageOptionsDto;
import com.huyphan.dtos.RegisterDataDto;
import com.huyphan.dtos.ReportDto;
import com.huyphan.dtos.ReportUserRequestDto;
import com.huyphan.dtos.SliceDto;
import com.huyphan.dtos.UpdatePasswordDataDto;
import com.huyphan.dtos.UpdateProfileDataDto;
import com.huyphan.dtos.UserDto;
import com.huyphan.dtos.UserSecretDto;
import com.huyphan.dtos.UserStatsDto;
import com.huyphan.mappers.PageMapper;
import com.huyphan.mappers.PageOptionMapper;
import com.huyphan.mappers.RegisterDataMapper;
import com.huyphan.mappers.ReportMapper;
import com.huyphan.mappers.ReportUserRequestMapper;
import com.huyphan.mappers.SliceMapper;
import com.huyphan.mappers.UpdatePasswordDataMapper;
import com.huyphan.mappers.UpdateProfileDataMapper;
import com.huyphan.mappers.UserMapper;
import com.huyphan.mappers.UserSecretMapper;
import com.huyphan.mappers.UserStatsMapper;
import com.huyphan.models.PageOptions;
import com.huyphan.models.RegisterData;
import com.huyphan.models.Report;
import com.huyphan.models.ReportUserRequest;
import com.huyphan.models.UpdatePasswordData;
import com.huyphan.models.UpdateProfileData;
import com.huyphan.models.User;
import com.huyphan.models.UserSecret;
import com.huyphan.models.UserStats;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.UserAlreadyExistsException;
import com.huyphan.models.exceptions.UserException;
import com.huyphan.services.UserService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private SliceMapper<UserDto, User> sliceMapper;

    @Autowired
    private PageOptionMapper pageOptionsMapper;

    @Autowired
    private UserStatsMapper userStatsMapper;

    @Autowired
    private UpdateProfileDataMapper updateProfileDataMapper;

    @Autowired
    private UpdatePasswordDataMapper updatePasswordDataMapper;

    @Autowired
    private UserSecretMapper userSecretMapper;

    @Autowired
    private PageMapper<UserDto, User> pageMapper;

    @Autowired
    private ReportUserRequestMapper reportUserRequestMapper;

    @Autowired
    private ReportMapper reportMapper;

    @Autowired
    private RegisterDataMapper registerDataMapper;

    /**
     * Get current authenticated user profile.
     */
    @GetMapping
    public UserDto getUser() {
        User user = UserService.getUser();
        return userMapper.toDto(user);
    }

    @GetMapping("{id}")
    public UserDto getUserById(@PathVariable Long id) throws UserException {
        User user = userService.getUserById(id);
        return userMapper.toDto(user);
    }

    @PutMapping("restrict/{userId}")
    public void restrict(@PathVariable Long userId) throws UserException {
        userService.restrict(userId);
    }

    @PutMapping("un-restrict/{userId}")
    public void unRestrict(@PathVariable Long userId) throws UserException {
        userService.unRestrict(userId);
    }

    @GetMapping("{id}/stats")
    public UserStatsDto getUserStats(@PathVariable Long id) throws UserException {
        UserStats userStats = userService.getUserStats(id);

        return userStatsMapper.toDto(userStats);
    }

    @PutMapping("follow/{id}")
    public void followUser(@PathVariable Long id) throws AppException {
        userService.followUser(id);
    }

    @PutMapping("unfollow/{id}")
    public void unFollowUser(@PathVariable Long id) throws UserException {
        userService.unFollowUser(id);
    }

    @GetMapping("{id}/followers")
    public SliceDto<UserDto> getUserFollowers(@PathVariable Long id, PageOptionsDto pageOptionsDto)
            throws AppException {
        PageOptions pageOptions = pageOptionsMapper.fromDto(pageOptionsDto);
        Slice<User> users = userService.getUserFollowers(pageOptions, id);

        return sliceMapper.toDto(users, userMapper);
    }

    @GetMapping("{id}/following")
    public SliceDto<UserDto> getUserFollowing(@PathVariable Long id, PageOptionsDto pageOptionsDto)
            throws AppException {
        PageOptions pageOptions = pageOptionsMapper.fromDto(pageOptionsDto);
        Slice<User> users = userService.getUserFollowing(pageOptions, id);

        return sliceMapper.toDto(users, userMapper);
    }

    @GetMapping("search")
    public SliceDto<UserDto> searchUser(PageOptionsDto pageOptionsDto) {
        PageOptions pageOptions = pageOptionsMapper.fromDto(pageOptionsDto);
        Slice<User> users = userService.searchUser(pageOptions);

        return sliceMapper.toDto(users, userMapper);
    }

    @PutMapping("recent-search/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addToRecentSearch(@PathVariable Long userId) throws UserException {
        userService.addToRecentSearch(userId);
    }

    @GetMapping("recent-search")
    public SliceDto<UserDto> getRecentSearch(PageOptionsDto pageOptionsDto) {
        PageOptions pageOptions = pageOptionsMapper.fromDto(pageOptionsDto);
        Slice<User> users = userService.getRecentSearch(pageOptions);

        return sliceMapper.toDto(users, userMapper);
    }

    @DeleteMapping("recent-search/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRecentSearch(@PathVariable Long userId) throws UserException {
        userService.deleteRecentSearch(userId);
    }

    @GetMapping("blocking")
    public SliceDto<UserDto> getBlockingUser(PageOptionsDto pageOptionsDto) {
        PageOptions pageOptions = pageOptionsMapper.fromDto(pageOptionsDto);
        Slice<User> slice = userService.getBlockingUser(pageOptions);

        return sliceMapper.toDto(slice, userMapper);
    }

    @PostMapping("admin/add")
    @ResponseStatus(HttpStatus.CREATED)
    public void addAdmin(@RequestBody RegisterDataDto registerDataDto) throws UserAlreadyExistsException {
        userService.addAdmin(
                registerDataMapper.fromDto(registerDataDto)
        );
    }

    @DeleteMapping("admin/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAdmin(@PathVariable Long id) throws UserException {
        userService.deleteAdmin(id);
    }

    @GetMapping("admins")
    public PageDto<UserDto> getAdmins(PageOptionsDto pageOptionsDto) {
        Page<User> page = userService.findAllAdmins(
                pageOptionsMapper.fromDto(pageOptionsDto)
        );

        return pageMapper.toDto(page, userMapper);
    }


    @GetMapping("restricting")
    public SliceDto<UserDto> getRestrictedUser(PageOptionsDto pageOptionsDto) {
        PageOptions pageOptions = pageOptionsMapper.fromDto(pageOptionsDto);
        Slice<User> slice = userService.getRestrictedUser(pageOptions);

        return sliceMapper.toDto(slice, userMapper);
    }

    @PutMapping("block/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void block(@PathVariable Long userId) throws UserException {
        userService.block(userId);
    }

    @PutMapping("suspend/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void suspend(@PathVariable Long userId) throws UserException {
        userService.suspendUser(userId);
    }

    @GetMapping("suspended/list")
    public PageDto<UserDto> getSuspendedUsers(PageOptionsDto pageOptionsDto) {
        PageOptions pageOptions = pageOptionsMapper.fromDto(pageOptionsDto);
        Page<User> users = userService.findAllSuspendedUsers(pageOptions);

        return pageMapper.toDto(users, userMapper);
    }

    @PutMapping("unsuspend/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unSuspend(@PathVariable Long userId) throws UserException {
        userService.unSuspendUser(userId);
    }

    @PostMapping("report")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void report(@RequestBody ReportUserRequestDto reportUserRequest) throws UserException {
        userService.reportUser(
                reportUserRequestMapper.fromDto(reportUserRequest)
        );
    }

    @GetMapping("{id}/reports")
    public List<ReportDto> getUserReports(@PathVariable long id) throws UserException {
        List<Report> reports = userService.getUserReports(id);
        return reports.stream().map(report -> reportMapper.toDto(report)).collect(Collectors.toList());
    }

    @GetMapping("all")
    public PageDto<UserDto> getAllUser(PageOptionsDto pageOptionsDto) {
        PageOptions pageOptions = pageOptionsMapper.fromDto(pageOptionsDto);
        Page<User> users = userService.getAllUsers(pageOptions);

        return pageMapper.toDto(users, userMapper);
    }

    @PutMapping("unblock/{userId}")
    public void unBlock(@PathVariable Long userId) throws UserException {
        userService.unblock(userId);
    }

    @PutMapping("profile")
    public UserSecretDto updateProfile(@RequestBody UpdateProfileDataDto updateProfileDataDto)
            throws UserException, UserAlreadyExistsException {
        UpdateProfileData updateProfileData = updateProfileDataMapper.fromDto(updateProfileDataDto);
        UserSecret userSecret = userService.updateProfile(updateProfileData);

        return userSecretMapper.toDto(userSecret);
    }

    @PutMapping("password")
    public void updatePassword(@RequestBody UpdatePasswordDataDto updatePasswordDataDto)
            throws AppException {
        UpdatePasswordData updatePasswordData = updatePasswordDataMapper.fromDto(
                updatePasswordDataDto);
        userService.updatePassword(updatePasswordData);
    }

    @DeleteMapping("follower/{id}")
    public void removeFollower(@PathVariable Long id) {
        userService.removeFollower(id);
    }

    @ExceptionHandler(AppException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppException handleExceptions(AppException exception) {
        return exception;
    }
}
