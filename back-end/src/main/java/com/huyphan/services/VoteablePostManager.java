package com.huyphan.services;

import com.huyphan.models.Post;
import com.huyphan.models.exceptions.UserException;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class VoteablePostManager extends VoteableObjectManager<Post> {

    @Autowired
    private UserService userService;

    @Override
    Set<Post> getUpvotedObjects() {
        try {
            return userService.getUserById(userService.getUser().getId()).getUpvotedPosts();
        } catch (UserException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    Set<Post> getDownvotedObjects() {
        try {
            return userService.getUserById(userService.getUser().getId()).getDownvotedPosts();
        } catch (UserException e) {
            e.printStackTrace();
            return null;
        }
    }
}
