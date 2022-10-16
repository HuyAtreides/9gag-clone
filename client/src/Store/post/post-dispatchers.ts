import { AppThunk } from '..';
import { Pagination } from '../../models/page';
import PageOptions from '../../models/page-options';
import {
  downvote,
  getPostList,
  unDownvote,
  unUpvote,
  upvote,
} from '../../services/post-service';
import { handleError } from '../../utils/error-handler';
import {
  setIsGettingPage,
  setIsLoading,
  setPosts,
  setPostErrorMessage,
  setPagination,
  appendNewPosts,
  setPostUpvotes,
  setPostDownvotes,
} from './post-slice';

export const getPosts =
  (pageOptions: PageOptions, tag: string, section?: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));

      const pageOfPosts = await getPostList(pageOptions, tag, section);

      const pagination: Pagination = {
        size: pageOfPosts.size,
        page: pageOfPosts.page,
        isLast: pageOfPosts.isLast,
      };

      dispatch(setIsLoading(false));
      dispatch(setPagination(pagination));
      dispatch(setPosts(pageOfPosts.content));
    } catch (error: unknown) {
      handleError(dispatch, error, setPostErrorMessage);
    }
  };

export const addNewPosts =
  (pageOptions: PageOptions, tag: string, section?: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsGettingPage(true));

      const pageOfPosts = await getPostList(pageOptions, tag, section);

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
