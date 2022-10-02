import { AppThunk } from '..';
import { Pagination } from '../../models/page';
import PageOptions from '../../models/page-options';
import { getPostList } from '../../services/post-service';
import { handleError } from '../../utils/error-handler';
import {
  setIsGettingPage,
  setIsLoading,
  setPosts,
  setPostErrorMessage,
  setPagination,
  appendNewPosts,
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
  (index?: number): AppThunk =>
  (dispatch, getState) => {
    try {
    } catch (error: unknown) {}
  };

export const unUpvotePost = (index?: number) => {
  try {
  } catch (error: unknown) {}
};
