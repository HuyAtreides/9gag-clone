import { message } from 'antd';
import { AppThunk } from '..';
import { Pagination } from '../../models/page';
import PageOptions from '../../models/page-options';
import { UploadPostFormData } from '../../models/upload-post-form-data';
import {
  addNewPost,
  deletePost,
  downvote,
  getPostList,
  getSpecificPost,
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

export const getPosts =
  (pageOptions: PageOptions, section?: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));

      const pageOfPosts = await getPostList(pageOptions, section);

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

export const addNewPosts =
  (pageOptions: PageOptions, section?: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsGettingPage(true));

      const pageOfPosts = await getPostList(pageOptions, section);

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

export const upvotePost =
  (index: number = 0): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPostUpvotes([index, 1]));
      await upvote(getState().post.posts![index].id);
    } catch (error: unknown) {
      dispatch(setPostUpvotes([index, -1]));
      handleError(
        dispatch,
        'Failed to upvote post. Please try again',
        setPostErrorMessage,
      );
    }
  };

export const unUpvotePost =
  (index: number = 0): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPostUpvotes([index, -1]));
      await unUpvote(getState().post.posts![index].id);
    } catch (error: unknown) {
      dispatch(setPostUpvotes([index, 1]));
      handleError(
        dispatch,
        'Failed to unupvote post. Please try again',
        setPostErrorMessage,
      );
    }
  };

export const downvotePost =
  (index: number = 0): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPostDownvotes([index, 1]));
      await downvote(getState().post.posts![index].id);
    } catch (error: unknown) {
      dispatch(setPostDownvotes([index, -1]));
      handleError(
        dispatch,
        'Failed to downvote post. Please try again',
        setPostErrorMessage,
      );
    }
  };

export const unDownvotePost =
  (index: number = 0): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPostDownvotes([index, -1]));
      await unDownvote(getState().post.posts![index].id);
    } catch (error: unknown) {
      dispatch(setPostDownvotes([index, 1]));
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
  (index: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      const post = getState().post.posts[index];
      savePost(post.id);
      dispatch(setPostIsSaved(index));
      message.success('Post saved!');
    } catch (error: unknown) {
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const remove =
  (index: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      const post = getState().post.posts[index];
      deletePost(post.id);
      dispatch(removePost(index));
      message.success('Post deleted!');
    } catch (error: unknown) {
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const unSave =
  (index: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      const post = getState().post.posts[index];
      unSavePost(post.id);
      dispatch(setPostIsSaved(index));
      message.success('Post unsaved!');
    } catch (error: unknown) {
      handleError(dispatch, error, setPostErrorMessage);
    }
  };
