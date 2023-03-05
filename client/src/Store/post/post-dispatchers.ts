import { message } from 'antd';
import { AppThunk } from '..';
import { Pagination } from '../../models/page';
import PageOptions from '../../models/page-options';
import Post from '../../models/post';
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
