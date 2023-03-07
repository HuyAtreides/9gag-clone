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
  downvote,
  getPostList,
  getSavedPostList,
  getSpecificPost,
  getUpvotedPostList,
  getUserPostList,
  PostFetchingFunc,
  savePost,
  unDownvote,
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
  setPostDownvotes,
  setPostErrorMessage,
  setPostIsSaved,
  setPosts,
  setPostUpvotes,
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
      const mediaLocation = await upload(newPostFormData.media);
      await addNewPost({
        title: newPostFormData.title,
        section: newPostFormData.section,
        mediaType: mediaLocation.type,
        mediaUrl: mediaLocation.url,
        tags: newPostFormData.tags,
      });
      dispatch(setIsLoading(false));
      message.success('Add new post successfully');
    } catch (error: unknown) {
      dispatch(setIsLoading(false));
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const save =
  (post: Post): AppThunk =>
  async (dispatch, getState) => {
    try {
      savePost(post.id);
      dispatch(setPostIsSaved(post));
      message.success('Post saved!');
    } catch (error: unknown) {
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
      unSavePost(post.id);
      dispatch(setPostIsSaved(post));
      message.success('Post unsaved!');
    } catch (error: unknown) {
      handleError(dispatch, error, setPostErrorMessage);
    }
  };
