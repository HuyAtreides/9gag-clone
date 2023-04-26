package com.huyphan.models.projections;

import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.services.UserService;


public interface PostWithDerivedFields {

    Post getPost();

    boolean getIsInUserFavSections();

    boolean getIsUpvoted();

    boolean getIsDownvoted();

    boolean getIsSaved();

    int getTotalComments();

    boolean getFollowed();

    default Post toPost() {
        Post post = getPost();
        User currentUser = UserService.getUser();
        post.setTotalComments(getTotalComments());
        post.setIsUpvoted(getIsUpvoted());
        post.setIsDownvoted(getIsDownvoted());
        post.setIsSaved(getIsSaved());
        post.setFollowed(getFollowed());

        if (post.isAnonymous() && !post.getOwner().equals(currentUser)) {
            post.setUser(null);
        }

        return post;
    }
}
