import { AppThunk } from '..';
import { PageFetchingRequest } from '../../models/requests/page-fetching-request';
import {
  FetchChatConversationFunc,
  createConversationWithUser,
} from '../../services/chat-service';
import { extractErrorMessage, handleError } from '../../utils/error-handler';
import {
  addConversationPage,
  openConversation,
  setConversation,
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

export const createNewConversation =
  (userId: number): AppThunk =>
  async (dispatch, getState) => {
    const openConversations = getState().chat.conversationState.openConversations;
    const length = openConversations.length;
    const index = length % 3;
    try {
      dispatch(openConversation(index));
      const conversation = await createConversationWithUser(userId);
      dispatch(
        setConversation({
          index,
          conversationState: {
            error: null,
            isLoading: false,
            conversation: conversation,
          },
        }),
      );
    } catch (error: unknown) {
      dispatch(
        setConversation({
          index,
          conversationState: {
            error: extractErrorMessage(error),
            isLoading: false,
            conversation: null,
          },
        }),
      );
    }
  };
