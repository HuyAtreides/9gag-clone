package com.huyphan.services;

import com.huyphan.models.Comment;
import com.huyphan.models.exceptions.UserException;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class VoteableCommentManager extends VoteableObjectManager<Comment> {

    @Autowired
    private UserService userService;

    @Override
    Set<Comment> getUpvotedObjects() {
        try {
            return userService.getUserById(UserService.getUser().getId()).getUpvotedComments();
        } catch (UserException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    Set<Comment> getDownvotedObjects() {
        try {
            return userService.getUserById(UserService.getUser().getId()).getDownvotedComments();
        } catch (UserException e) {
            e.printStackTrace();
            return null;
        }
    }
}
