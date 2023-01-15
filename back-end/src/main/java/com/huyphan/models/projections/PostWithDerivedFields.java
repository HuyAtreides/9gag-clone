package com.huyphan.models.projections;

import com.huyphan.models.Post;


public interface PostWithDerivedFields {

    Post getPost();

    boolean getIsInUserFavSections();

    boolean getIsUpvoted();

    boolean getIsDownvoted();

    int getTotalComments();

    default Post toPost() {
        Post post = getPost();
        post.setTotalComments(getTotalComments());
        post.setIsUpvoted(getIsUpvoted());
        post.setIsDownvoted(getIsDownvoted());

        return post;
    }
}
