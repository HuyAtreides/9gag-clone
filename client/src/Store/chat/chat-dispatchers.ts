import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { AppThunk } from '..';
import ChatConversation from '../../models/chat-conversation';
import { ConversationMessagesFetchingRequest } from '../../models/requests/conversation-messages-fetching-request';
import { PageFetchingRequest } from '../../models/requests/page-fetching-request';
import Slice from '../../models/slice';
import {
  FetchChatConversationFunc,
  createConversationWithUser,
  getAllLatestChatMessage,
  getConversationMessages,
  getConversationsWithNewestMessage,
  getMessage,
  getSpecificConversation,
  getUnreadConversationCount,
  markConversationAsRead,
  removeChatMessage,
  sendMessage,
} from '../../services/chat-service';
import { extractErrorMessage, handleError } from '../../utils/error-handler';
import {
  addIsSendingId,
  addMessage,
  addMessagePage,
  openConversation,
  setConversation,
  setConversationLoadingError,
  setGetMessagePageError,
  setMessageIsGettingPage,
  setMessageIsLoading,
  setMessagePage,
  setPersistedMessage,
  setSendingMessageError,
  removeIsSendingId,
  resetIsSendingIds,
  addLatestPreviewConversations,
  setPreviewChatMessage,
  addLatestMessages,
  updateConversation,
  markPreviewConversationAsRead,
  subtractUnreadCount,
  setUnreadCount,
  removeMessage,
} from './chat-slice';
import { NewChatMessageFormData } from '../../models/new-chat-message-form-data';
import NewChatMessageData from '../../models/new-chat-message-data';
import ChatMessage from '../../models/chat-message';
import { getMediaLocationFromForm } from '../../utils/get-media-location-from-form';
import { User } from '../../models/user';

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

const createNewMessageDataFromFormData = (formData: NewChatMessageFormData) => {
  const { text, file } = formData;

  if (text == null && file == null) {
    throw new Error('Text and file can not be both null');
  }

  const sentDate = new Date();
  const messageContent = {
    text: text || null,
    mediaType: file?.originFileObj?.type || null,
    mediaUrl: file?.url || null,
    uploadFile: file,
  };
  const newChatMessageData: NewChatMessageData = {
    sentDate: sentDate,
    content: messageContent,
  };

  return newChatMessageData;
};

const createTransientChatMessage = (
  conversationId: number,
  newMessageData: NewChatMessageData,
  owner: User,
) => {
  const { sentDate, content } = newMessageData;
  const transientId = sentDate.getTime();
  const transientChatMessage: ChatMessage = {
    id: transientId,
    content: content,
    lastEditDate: sentDate,
    sentDate: sentDate,
    pinned: false,
    deleted: false,
    conversationId: conversationId,
    edited: false,
    owner: owner,
  };

  return transientChatMessage;
};

export const addNewMessage =
  (conversationId: number, formData: NewChatMessageFormData): AppThunk =>
  async (dispatch, getState) => {
    const newChatMessageData: NewChatMessageData =
      createNewMessageDataFromFormData(formData);

    const transientChatMessage: ChatMessage = createTransientChatMessage(
      conversationId,
      newChatMessageData,
      getState().user.profile!,
    );
    const transientId = transientChatMessage.id;

    try {
      dispatch(addIsSendingId({ conversationId, id: transientId }));
      dispatch(addMessage({ conversationId, message: transientChatMessage }));
      const mediaLocation = await getMediaLocationFromForm(formData.file);
      const persistedChatMessage = await sendMessage(conversationId, {
        ...newChatMessageData,
        content: {
          ...newChatMessageData.content,
          mediaType: mediaLocation.type,
          mediaUrl: mediaLocation.url,
        },
      });
      dispatch(removeIsSendingId({ conversationId, id: transientId }));
      dispatch(
        setPersistedMessage({
          conversationId,
          transientId,
          chatMessage: persistedChatMessage,
        }),
      );
    } catch (error: unknown) {
      dispatch(
        setSendingMessageError({
          conversationId,
          messageId: transientId,
          error: 'Error while sending message',
        }),
      );
      dispatch(resetIsSendingIds(conversationId));
    }
  };

export const readConversation =
  (conversationId: number): AppThunk =>
  (dispatch, getState) => {
    try {
      const currentUser = getState().user.profile;
      markConversationAsRead(conversationId);
      dispatch(markPreviewConversationAsRead({ conversationId, user: currentUser }));
      dispatch(subtractUnreadCount());
    } catch (error: unknown) {}
  };

export const getLatestConversationsState = (): AppThunk => (dispatch, getState) => {
  try {
    dispatch(getLatestConversation());
    dispatch(getLatestMessages());
  } catch (error: unknown) {}
};

export const countUnreadConversation = (): AppThunk => async (dispatch, _) => {
  const count = await getUnreadConversationCount();
  dispatch(setUnreadCount(count));
};

export const resetUnreadCount = (): AppThunk => (dispatch, _) => {
  dispatch(setUnreadCount(0));
};

const getLatestConversation = (): AppThunk => async (dispatch, getState) => {
  const currentConversations = getState().chat.conversationState.conversations;
  const latestMessageId =
    currentConversations.length === 0 ? 0 : currentConversations[0].latestChatMessageId;
  const latestConversations = await getConversationsWithNewestMessage(latestMessageId);
  dispatch(addLatestPreviewConversations(latestConversations));
};

export const updateOpenConversation = (): AppThunk => (dispatch, getState) => {
  try {
    getState().chat.conversationState.openConversations.forEach((openConversation) => {
      if (openConversation.conversation) {
        getSpecificConversation(openConversation.conversation.id).then((value) =>
          dispatch(updateConversation(value)),
        );
      }
    });
  } catch (error: unknown) {}
};

export const getLatestMessages = (): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const currentConversations = state.chat.conversationState.conversations;
  const latestMessageId =
    currentConversations.length === 0 ? 0 : currentConversations[0].latestChatMessageId;
  const openConversationIds = state.chat.conversationState.openConversations
    .map((openConversation) => openConversation.conversation?.id)
    .filter((id) => id != null);

  if (openConversationIds.length === 0) {
    return;
  }

  const latestChatMessages = await getAllLatestChatMessage(latestMessageId);
  const relevantChatMessages = latestChatMessages.filter((message) =>
    openConversationIds.includes(message.conversationId),
  );

  dispatch(addLatestMessages(relevantChatMessages));
};

export const getPossiblyUpdatedMessages = (): AppThunk => async (dispatch, getState) => {
  try {
  } catch (error: unknown) {}
};

export const getPreviewMessage =
  (conversationId: number, previewMessageId: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(
        setPreviewChatMessage({
          conversationId,
          messageState: {
            loading: true,
            message: null,
            error: null,
          },
        }),
      );
      const previewMessage = await getMessage(previewMessageId);
      dispatch(
        setPreviewChatMessage({
          conversationId,
          messageState: {
            loading: false,
            message: previewMessage,
            error: null,
          },
        }),
      );
    } catch (error: unknown) {
      dispatch(
        setPreviewChatMessage({
          conversationId,
          messageState: {
            loading: false,
            message: null,
            error: 'Fail to get preview message',
          },
        }),
      );
    }
  };

export const remove =
  (conversationId: number, messageId: number): AppThunk =>
  (dispatch, getState) => {
    try {
      dispatch(removeMessage({ conversationId, messageId }));
      removeChatMessage(messageId);
    } catch (error: unknown) {}
  };
