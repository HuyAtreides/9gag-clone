package com.huyphan.models.projections;

import com.huyphan.models.Comment;

public interface CommentWithDerivedFields {

    Comment getComment();

    boolean getIsUpvoted();

    boolean getIsDownvoted();

    int getTotalChildren();

    default Comment toComment() {
        Comment comment = getComment();
        comment.setDownvoted(getIsDownvoted());
        comment.setUpvoted(getIsUpvoted());
        comment.setTotalChildren(getTotalChildren());

        return comment;
    }
}
