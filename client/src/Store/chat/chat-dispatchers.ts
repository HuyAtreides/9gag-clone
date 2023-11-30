import { AppThunk } from '..';
import { PageFetchingRequest } from '../../models/requests/page-fetching-request';
import { FetchChatConversationFunc } from '../../services/chat-service';
import { handleError } from '../../utils/error-handler';
import {
  addConversationPage,
  setConversationIsGettingPage,
  setConversationIsLoading,
  setConversationLoadingError,
} from './chat-slice';

export const getConversationsPageDispatcher =
  <T extends PageFetchingRequest>(
    request: T,
    fetchFunc: FetchChatConversationFunc<T>,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setConversationIsLoading(true));
      const conversationPage = await fetchFunc(request);

      dispatch(setConversationIsLoading(false));
      dispatch(addConversationPage(conversationPage));
    } catch (error: unknown) {
      dispatch(setConversationIsLoading(false));
      handleError(dispatch, error, setConversationLoadingError);
    }
  };

export const appendConversationsPageDispatcher =
  <T extends PageFetchingRequest>(
    request: T,
    fetchFunc: FetchChatConversationFunc<T>,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setConversationIsGettingPage(true));
      const conversationPage = await fetchFunc(request);

      dispatch(setConversationIsGettingPage(false));
      dispatch(addConversationPage(conversationPage));
    } catch (error: unknown) {
      dispatch(setConversationIsGettingPage(false));
      handleError(dispatch, error, setConversationLoadingError);
    }
  };
