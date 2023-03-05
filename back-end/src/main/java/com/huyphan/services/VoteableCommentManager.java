package com.huyphan.services;

import com.huyphan.models.Comment;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class VoteableCommentManager extends VoteableObjectManager<Comment> {

    @Autowired
    private UserService userService;

    @Override
    Set<Comment> getUpvotedObjects() {
        return userService.getCurrentUser().getUpvotedComments();
    }

    @Override
    Set<Comment> getDownvotedObjects() {
        return userService.getCurrentUser().getDownvotedComments();
    }
}
