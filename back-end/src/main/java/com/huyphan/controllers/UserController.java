package com.huyphan.controllers;

import com.huyphan.dtos.PageOptionsDto;
import com.huyphan.dtos.SliceDto;
import com.huyphan.dtos.UpdatePasswordDataDto;
import com.huyphan.dtos.UpdateProfileDataDto;
import com.huyphan.dtos.UserDto;
import com.huyphan.dtos.UserSecretDto;
import com.huyphan.dtos.UserStatsDto;
import com.huyphan.mappers.PageMapper;
import com.huyphan.mappers.PageOptionMapper;
import com.huyphan.mappers.SliceMapper;
import com.huyphan.mappers.UpdatePasswordDataMapper;
import com.huyphan.mappers.UpdateProfileDataMapper;
import com.huyphan.mappers.UserMapper;
import com.huyphan.mappers.UserSecretMapper;
import com.huyphan.mappers.UserStatsMapper;
import com.huyphan.models.PageOptions;
import com.huyphan.models.UpdatePasswordData;
import com.huyphan.models.UpdateProfileData;
import com.huyphan.models.User;
import com.huyphan.models.UserSecret;
import com.huyphan.models.UserStats;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.UserException;
import com.huyphan.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
            throws UserException {
        PageOptions pageOptions = pageOptionsMapper.fromDto(pageOptionsDto);
        Slice<User> users = userService.getUserFollowers(pageOptions, id);

        return sliceMapper.toDto(users, userMapper);
    }

    @GetMapping("{id}/following")
    public SliceDto<UserDto> getUserFollowing(@PathVariable Long id, PageOptionsDto pageOptionsDto)
            throws UserException {
        PageOptions pageOptions = pageOptionsMapper.fromDto(pageOptionsDto);
        Slice<User> users = userService.getUserFollowing(pageOptions, id);

        return sliceMapper.toDto(users, userMapper);
    }

    @PutMapping("profile")
    public UserSecretDto updateProfile(@RequestBody UpdateProfileDataDto updateProfileDataDto)
            throws UserException {
        UpdateProfileData updateProfileData = updateProfileDataMapper.fromDto(updateProfileDataDto);
        UserSecret userSecret = userService.updateProfile(updateProfileData);

        return userSecretMapper.toDto(userSecret);
    }

    @PutMapping("password")
    public void updatePassword(@RequestBody UpdatePasswordDataDto updatePasswordDataDto)
            throws AppException {
        UpdatePasswordData updatePasswordData = updatePasswordDataMapper.fromDto(updatePasswordDataDto);
        userService.updatePassword(updatePasswordData);
    }

    @DeleteMapping("follower/{id}")
    public void removeFollower(@PathVariable Long id) {
        userService.removeFollower(id);
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public UserException handleExceptions(UserException exception) {
        return exception;
    }
}
