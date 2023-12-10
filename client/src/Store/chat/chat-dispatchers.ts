import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { AppThunk } from '..';
import ChatConversation from '../../models/chat-conversation';
import { ConversationMessagesFetchingRequest } from '../../models/requests/conversation-messages-fetching-request';
import { PageFetchingRequest } from '../../models/requests/page-fetching-request';
import Slice from '../../models/slice';
import {
  FetchChatConversationFunc,
  createConversationWithUser,
  getConversationMessages,
} from '../../services/chat-service';
import { extractErrorMessage, handleError } from '../../utils/error-handler';
import {
  addMessagePage,
  openConversation,
  setConversation,
  setConversationLoadingError,
  setGetMessagePageError,
  setMessageIsGettingPage,
  setMessageIsLoading,
  setMessagePage,
} from './chat-slice';

type ConversationListStateActionCreator = {
  setIsLoading: ActionCreatorWithPayload<boolean>;
  setIsGettingPage: ActionCreatorWithPayload<boolean>;
  setPage: ActionCreatorWithPayload<Slice<ChatConversation>>;
  addPage: ActionCreatorWithPayload<Slice<ChatConversation>>;
};

export const getConversationsPageDispatcher =
  <T extends PageFetchingRequest>(
    request: T,
    fetchFunc: FetchChatConversationFunc<T>,
    actionCreators: ConversationListStateActionCreator,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(actionCreators.setIsLoading(true));
      const conversationPage = await fetchFunc(request);
      dispatch(actionCreators.setIsLoading(false));
      dispatch(actionCreators.setPage(conversationPage));
    } catch (error: unknown) {
      dispatch(actionCreators.setIsLoading(false));
      handleError(dispatch, error, setConversationLoadingError);
    }
  };

export const appendConversationsPageDispatcher =
  <T extends PageFetchingRequest>(
    request: T,
    fetchFunc: FetchChatConversationFunc<T>,
    actionCreators: ConversationListStateActionCreator,
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(actionCreators.setIsGettingPage(true));
      const conversationPage = await fetchFunc(request);
      dispatch(actionCreators.setIsGettingPage(false));
      dispatch(actionCreators.addPage(conversationPage));
    } catch (error: unknown) {
      dispatch(actionCreators.setIsGettingPage(false));
      handleError(dispatch, error, setConversationLoadingError);
    }
  };

export const createNewConversation =
  (userId: number): AppThunk =>
  async (dispatch, getState) => {
    const openConversations = getState().chat.conversationState.openConversations;
    const userIdsInCurrentOpenConversations = openConversations.map(
      (openConversation) => openConversation.userId,
    );
    const length = openConversations.length;
    const index = length % 3;

    if (userIdsInCurrentOpenConversations.some((id) => id === userId)) {
      return;
    }

    try {
      dispatch(openConversation({ index, userId }));
      const conversation = await createConversationWithUser(userId);
      dispatch(
        setConversation({
          index,
          conversationState: {
            error: null,
            isLoading: false,
            userId,
            conversation: conversation,
          },
        }),
      );
    } catch (error: unknown) {
      dispatch(
        setConversation({
          index,
          conversationState: {
            userId,
            error: extractErrorMessage(error),
            isLoading: false,
            conversation: null,
          },
        }),
      );
    }
  };

export const getMessagePage =
  (pageFetchingRequest: ConversationMessagesFetchingRequest): AppThunk =>
  async (dispatch, getState) => {
    const { conversationId } = pageFetchingRequest;
    try {
      dispatch(setMessageIsLoading({ conversationId, isLoading: true }));
      const messagePage = await getConversationMessages(pageFetchingRequest);
      dispatch(setMessageIsLoading({ conversationId, isLoading: false }));
      dispatch(setMessagePage({ conversationId, slice: messagePage }));
    } catch (error: unknown) {
      dispatch(setMessageIsLoading({ conversationId, isLoading: false }));
      dispatch(
        setGetMessagePageError({
          conversationId,
          error: extractErrorMessage(error),
        }),
      );
    }
  };

export const addNewMessagePage =
  (pageFetchingRequest: ConversationMessagesFetchingRequest): AppThunk =>
  async (dispatch, getState) => {
    const { conversationId } = pageFetchingRequest;
    try {
      dispatch(setMessageIsGettingPage({ conversationId, isGettingPage: true }));
      const messagePage = await getConversationMessages(pageFetchingRequest);
      dispatch(setMessageIsGettingPage({ conversationId, isGettingPage: false }));
      dispatch(addMessagePage({ conversationId, slice: messagePage }));
    } catch (error: unknown) {
      dispatch(setMessageIsGettingPage({ conversationId, isGettingPage: false }));
      dispatch(
        setGetMessagePageError({
          conversationId,
          error: extractErrorMessage(error),
        }),
      );
    }
  };
