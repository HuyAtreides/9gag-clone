import { message } from 'antd';
import { AppThunk } from '..';
import { Pagination } from '../../models/page';
import Post from '../../models/post';
import { PostsFetchingRequest } from '../../models/requests/posts-fetching-request';
import { UserSpecificPostFetchingRequest } from '../../models/requests/user-specific-posts-fetching-request';
import { UploadPostFormData } from '../../models/upload-post-form-data';
import {
  addNewPost,
  deletePost,
  disablePostAnonymous,
  downvote,
  enablePostAnonymous,
  followPost,
  getFollowingPostList,
  getPostList,
  getSavedPostList,
  getSpecificPost,
  getUpvotedPostList,
  getUserPostList,
  PostFetchingFunc,
  savePost,
  turnOffPostNotifications,
  turnOnPostNotifications,
  unDownvote,
  unFollowPost,
  unSavePost,
  unUpvote,
  upvote,
} from '../../services/post-service';
import { upload } from '../../services/upload-service';
import { handleError } from '../../utils/error-handler';
import {
  appendNewPosts,
  removePost,
  setIsGettingPage,
  setIsLoading,
  setPagination,
  setPostAnonymous,
  setPostDownvotes,
  setPostErrorMessage,
  setPostFollowed,
  setPostIsSaved,
  setPosts,
  setPostUpvotes,
  setSendNotifications,
} from './post-slice';

export type FetchPostsThunkAction<T extends PostsFetchingRequest> = (
  postsFetchingRequest: T,
) => AppThunk;

const getPostsDispatcher =
  <T extends PostsFetchingRequest>(
    postsFetchingRequest: T,
    fetchPost: PostFetchingFunc<T>,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));

      const pageOfPosts = await fetchPost(postsFetchingRequest);

      const pagination: Pagination = {
        size: pageOfPosts.size,
        page: pageOfPosts.page,
        isLast: pageOfPosts.isLast,
      };

      dispatch(setIsLoading(false));
      dispatch(setPagination(pagination));
      dispatch(setPosts(pageOfPosts.content));
    } catch (error: unknown) {
      dispatch(setIsLoading(false));
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

const addNewPostsDispatcher =
  <T extends PostsFetchingRequest>(
    postsFetchingRequest: T,
    fetchPost: PostFetchingFunc<T>,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsGettingPage(true));

      const pageOfPosts = await fetchPost(postsFetchingRequest);

      const pagination: Pagination = {
        size: pageOfPosts.size,
        page: pageOfPosts.page,
        isLast: pageOfPosts.isLast,
      };

      dispatch(setIsGettingPage(false));
      dispatch(setPagination(pagination));
      dispatch(appendNewPosts(pageOfPosts.content));
    } catch (error: unknown) {
      dispatch(setIsGettingPage(false));
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const getPosts = (postsFetchingRequest: PostsFetchingRequest): AppThunk => {
  return getPostsDispatcher(postsFetchingRequest, getPostList);
};

export const getSavedPosts = (
  postsFetchingRequest: UserSpecificPostFetchingRequest,
): AppThunk => {
  return getPostsDispatcher(postsFetchingRequest, getSavedPostList);
};

export const getUpvotedPosts = (
  postsFetchingRequest: UserSpecificPostFetchingRequest,
): AppThunk => {
  return getPostsDispatcher(postsFetchingRequest, getUpvotedPostList);
};

export const getUserPosts = (
  postsFetchingRequest: UserSpecificPostFetchingRequest,
): AppThunk => {
  return getPostsDispatcher(postsFetchingRequest, getUserPostList);
};

export const addNewPosts = (postsFetchingRequest: PostsFetchingRequest) => {
  return addNewPostsDispatcher(postsFetchingRequest, getPostList);
};

export const addNewSavedPosts = (
  postsFetchingRequest: UserSpecificPostFetchingRequest,
) => {
  return addNewPostsDispatcher(postsFetchingRequest, getSavedPostList);
};

export const addNewUpvotedPosts = (
  postsFetchingRequest: UserSpecificPostFetchingRequest,
) => {
  return addNewPostsDispatcher(postsFetchingRequest, getUpvotedPostList);
};

export const addNewUserPosts = (
  postsFetchingRequest: UserSpecificPostFetchingRequest,
) => {
  return addNewPostsDispatcher(postsFetchingRequest, getUserPostList);
};

export const getPost =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      const post = await getSpecificPost(id);
      dispatch(setPosts([post]));
      dispatch(setIsLoading(false));
    } catch (error: unknown) {
      dispatch(setIsLoading(false));
      dispatch(setPosts([]));
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const upvotePost =
  (post: Post): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPostUpvotes([post, 1]));
      await upvote(post.id);
    } catch (error: unknown) {
      dispatch(setPostUpvotes([post, -1]));
      handleError(
        dispatch,
        'Failed to upvote post. Please try again',
        setPostErrorMessage,
      );
    }
  };

export const unUpvotePost =
  (post: Post): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPostUpvotes([post, -1]));
      await unUpvote(post.id);
    } catch (error: unknown) {
      dispatch(setPostUpvotes([post, 1]));
      handleError(
        dispatch,
        'Failed to unupvote post. Please try again',
        setPostErrorMessage,
      );
    }
  };

export const downvotePost =
  (post: Post): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPostDownvotes([post, 1]));
      await downvote(post.id);
    } catch (error: unknown) {
      dispatch(setPostDownvotes([post, -1]));
      handleError(
        dispatch,
        'Failed to downvote post. Please try again',
        setPostErrorMessage,
      );
    }
  };

export const unDownvotePost =
  (post: Post): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPostDownvotes([post, -1]));
      await unDownvote(post.id);
    } catch (error: unknown) {
      dispatch(setPostDownvotes([post, 1]));
      handleError(
        dispatch,
        'Failed to undownvote post. Please try again',
        setPostErrorMessage,
      );
    }
  };

export const uploadNewPost =
  (newPostFormData: UploadPostFormData): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      const mediaLocation = newPostFormData.media
        ? await upload(newPostFormData.media)
        : {
            type: null,
            url: null,
          };
      await addNewPost({
        title: newPostFormData.title,
        section: newPostFormData.section,
        mediaType: mediaLocation.type,
        mediaUrl: mediaLocation.url,
        tags: newPostFormData.tags,
        contentType: newPostFormData.contentType,
        text: newPostFormData.text || null,
        anonymous: newPostFormData.anonymous,
        notificationEnabled: newPostFormData.notificationEnabled,
      });
      dispatch(setIsLoading(false));
      message.success('Add new post successfully');
    } catch (error: unknown) {
      dispatch(setIsLoading(false));
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const enableAnonymous =
  (post: Post): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPostAnonymous(post));
      message.success('Post is now anonymous!');
      await enablePostAnonymous(post.id);
    } catch (error: unknown) {
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const disableAnonymous =
  (post: Post): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPostAnonymous(post));
      message.success('Post is no longer anonymous!');
      await disablePostAnonymous(post.id);
    } catch (error: unknown) {
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const save =
  (post: Post): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPostIsSaved(post));
      message.success('Post saved!');
      await savePost(post.id);
    } catch (error: unknown) {
      dispatch(setPostIsSaved(post));
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const remove =
  (post: Post): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(removePost(post));
      message.success('Post deleted!');
      await deletePost(post.id);
    } catch (error: unknown) {
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const unSave =
  (post: Post): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPostIsSaved(post));
      message.success('Post unsaved!');
      await unSavePost(post.id);
    } catch (error: unknown) {
      dispatch(setPostIsSaved(post));
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const follow =
  (post: Post): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPostFollowed(post));
      message.success('Post followed!');
      await followPost(post.id);
    } catch (error: unknown) {
      dispatch(setPostFollowed(post));
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const unFollow =
  (post: Post): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPostFollowed(post));
      message.success('Post un followed!');
      await unFollowPost(post.id);
    } catch (error: unknown) {
      dispatch(setPostFollowed(post));
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const turnOnNotification =
  (post: Post): AppThunk =>
  async (dispatch, getState) => {
    try {
      turnOnPostNotifications(post.id);
      dispatch(setSendNotifications(post));
      message.success('You will now receive notifications from this post!');
    } catch (error: unknown) {
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const turnOffNotification =
  (post: Post): AppThunk =>
  async (dispatch, getState) => {
    try {
      turnOffPostNotifications(post.id);
      dispatch(setSendNotifications(post));
      message.success("You won't receive notifications from this post!");
    } catch (error: unknown) {
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const getFollowingPosts = (
  postsFetchingRequest: UserSpecificPostFetchingRequest,
): AppThunk => {
  return getPostsDispatcher(postsFetchingRequest, getFollowingPostList);
};

export const addNewFollowingPosts = (
  postsFetchingRequest: UserSpecificPostFetchingRequest,
) => {
  return addNewPostsDispatcher(postsFetchingRequest, getFollowingPostList);
};
