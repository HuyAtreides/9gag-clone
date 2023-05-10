package com.huyphan.services;

import com.huyphan.models.Post;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class VoteablePostManager extends VoteableObjectManager<Post> {

    @Autowired
    private UserService userService;

    @Override
    Set<Post> getUpvotedObjects() {
        return userService.getCurrentUser().getUpvotedPosts();
    }

    @Override
    Set<Post> getDownvotedObjects() {
        return userService.getCurrentUser().getDownvotedPosts();
    }
}
