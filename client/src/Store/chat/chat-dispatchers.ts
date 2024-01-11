import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { AppThunk } from '..';
import ChatConversation from '../../models/chat-conversation';
import ChatMessage from '../../models/chat-message';
import { Constant, MediaType } from '../../models/enums/constant';
import NewChatMessageData from '../../models/new-chat-message-data';
import { NewChatMessageFormData } from '../../models/new-chat-message-form-data';
import { ConversationMessagesFetchingRequest } from '../../models/requests/conversation-messages-fetching-request';
import { PageFetchingRequest } from '../../models/requests/page-fetching-request';
import Slice from '../../models/slice';
import { User } from '../../models/user';
import {
  FetchChatConversationFunc,
  createConversationWithUser,
  editMessage,
  getAllLatestChatMessage,
  getAllMessagesInRange,
  getConversationMessages,
  getConversationMessagesInRange,
  getConversationsWithNewestMessage,
  getMessage,
  getPinnedMessages,
  getSpecificConversation,
  getUnreadConversationCount,
  markAllAsRead,
  markConversationAsRead,
  pinMessage,
  removeChatMessage,
  sendMessage,
  sendReply,
  unPinMessage,
} from '../../services/chat-service';
import { extractErrorMessage, handleError } from '../../utils/error-handler';
import { getMediaLocationFromForm } from '../../utils/get-media-location-from-form';
import { isFileType } from '../../utils/mime-type';
import {
  addIsSendingId,
  addLatestMessages,
  addLatestPreviewConversations,
  addMessage,
  addMessagePage,
  addMessages,
  addPinnedMessagesPage,
  addUnreadCount,
  markOpenConversationAsRead,
  markPreviewConversationAsRead,
  openConversation,
  removeIsSendingId,
  removeMessage,
  setConversation,
  setConversationLoadingError,
  setGetMessagePageError,
  setMessageIsGettingPage,
  setMessageIsLoading,
  setMessagePage,
  setMessagePinned,
  setMessagesPagination,
  setPersistedMessage,
  setPinnedMessageError,
  setPinnedMessageIsGettingPage,
  setPinnedMessageIsLoading,
  setPinnedMessagesPage,
  setPreviewChatMessage,
  setPreviewConversationError,
  setSendingMessageError,
  setSyncError,
  setUnreadCount,
  subtractUnreadCount,
  syncMessages,
  updateConversation,
  updateMessage,
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
      if (
        getState().chat.conversationState.openConversations.find(
          (openConversation) => openConversation.userId === userId,
        )?.conversation != null
      ) {
        return;
      }

      dispatch(
        setConversation({
          error: null,
          isLoading: false,
          userId,
          conversation: conversation,
        }),
      );
    } catch (error: unknown) {
      dispatch(
        setConversation({
          userId,
          error: extractErrorMessage(error),
          isLoading: false,
          conversation: null,
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

export const fetchPinnedMessages =
  (pageFetchingRequest: ConversationMessagesFetchingRequest): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPinnedMessageIsLoading(true));
      const messagePage = await getPinnedMessages(pageFetchingRequest);
      dispatch(setPinnedMessageIsLoading(false));
      dispatch(setPinnedMessagesPage(messagePage));
    } catch (error: unknown) {
      dispatch(setPinnedMessageIsLoading(false));
      handleError(dispatch, error, setPinnedMessageError);
    }
  };

export const appendPinnedMessages =
  (pageFetchingRequest: ConversationMessagesFetchingRequest): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setPinnedMessageIsGettingPage(true));
      const messagePage = await getPinnedMessages(pageFetchingRequest);
      dispatch(setPinnedMessageIsGettingPage(false));
      dispatch(addPinnedMessagesPage(messagePage));
    } catch (error: unknown) {
      dispatch(setPinnedMessageIsGettingPage(false));
      handleError(dispatch, error, setPinnedMessageError);
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

  if ((text == null || !text.trim()) && file == null) {
    throw new Error('Text and file can not be both null');
  }

  const isFile = isFileType(file?.originFileObj?.type || file?.type);
  const sentDate = new Date();
  const messageContent = {
    text: text || null,
    mediaType: isFile ? MediaType.File : file?.originFileObj?.type || file?.type || null,
    mediaUrl: file?.url || null,
    uploadFile: file,
  };
  const newChatMessageData: NewChatMessageData = {
    sentDate: sentDate,
    content: messageContent,
  };

  return newChatMessageData;
};

export const readAllConversation = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(resetUnreadCount());
    const state = getState();
    const user = state.user.profile!;
    state.chat.conversationState.previewConversations.conversations.forEach((preview) =>
      dispatch(markPreviewConversationAsRead({ conversationId: preview.id, user })),
    );
    await markAllAsRead();
  } catch (err: unknown) {
    dispatch(
      setPreviewConversationError(
        'Failed to mark all conversations as read. Please try again later',
      ),
    );
  }
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

export const edit =
  (
    conversationId: number,
    messageId: number,
    formData: NewChatMessageFormData,
  ): AppThunk =>
  async (dispatch, getState) => {
    const { content } = createNewMessageDataFromFormData(formData);
    try {
      dispatch(updateMessage({ conversationId, messageId, content }));
      await editMessage(messageId, content);
    } catch (error: unknown) {}
  };

export const pin =
  (conversationId: number, messageId: number): AppThunk =>
  async (dispatch) => {
    dispatch(setMessagePinned({ conversationId, messageId, pinned: true }));
    await pinMessage(messageId);
  };

export const unPin =
  (conversationId: number, messageId: number): AppThunk =>
  async (dispatch) => {
    dispatch(setMessagePinned({ conversationId, messageId, pinned: false }));
    await unPinMessage(messageId);
  };

const send =
  (conversationId: number, transientChatMessage: ChatMessage): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(addIsSendingId({ conversationId, id: transientChatMessage.id }));
      dispatch(addMessage({ conversationId, message: transientChatMessage }));
      const mediaLocation = await getMediaLocationFromForm(
        transientChatMessage.content.uploadFile,
      );
      const newMessageData = {
        sentDate: transientChatMessage.sentDate,
        content: {
          ...transientChatMessage.content,
          mediaUrl: mediaLocation.url,
        },
      };
      let persistedChatMessage;

      if (transientChatMessage.replyToMessage) {
        persistedChatMessage = await sendReply(
          transientChatMessage.replyToMessage.id,
          newMessageData,
        );
      } else {
        persistedChatMessage = await sendMessage(conversationId, newMessageData);
      }

      dispatch(removeIsSendingId({ conversationId, id: transientChatMessage.id }));
      dispatch(
        setPersistedMessage({
          conversationId,
          transientId: transientChatMessage.id,
          chatMessage: persistedChatMessage,
        }),
      );
    } catch (error: unknown) {
      dispatch(
        setSendingMessageError({
          conversationId,
          messageId: transientChatMessage.id,
          error: 'Error while sending message',
        }),
      );
      dispatch(removeIsSendingId({ conversationId, id: transientChatMessage.id }));
    }
  };

export const resendMessage =
  (conversationId: number, messageId: number): AppThunk =>
  (dispatch, getState) => {
    const state = getState();

    const transientMessage = state.chat.messageState[conversationId].messages.find(
      (message) => message.id === messageId,
    );

    if (transientMessage == null) {
      throw new Error("Message doesn't exist");
    }

    dispatch(
      setSendingMessageError({
        conversationId,
        messageId: transientMessage.id,
        error: null,
      }),
    );
    dispatch(send(conversationId, transientMessage));
  };

export const addNewMessage =
  (conversationId: number, formData: NewChatMessageFormData): AppThunk =>
  async (dispatch, getState) => {
    const newChatMessageData = createNewMessageDataFromFormData(formData);
    const transientChatMessage: ChatMessage = createTransientChatMessage(
      conversationId,
      newChatMessageData,
      getState().user.profile!,
    );
    dispatch(send(conversationId, transientChatMessage));
  };

export const reply =
  (replyToMessage: ChatMessage, formData: NewChatMessageFormData): AppThunk =>
  async (dispatch, getState) => {
    const newChatMessageData = createNewMessageDataFromFormData(formData);
    const transientChatMessage: ChatMessage = {
      ...createTransientChatMessage(
        replyToMessage.conversationId,
        newChatMessageData,
        getState().user.profile!,
      ),
      replyToMessage: replyToMessage,
    };
    dispatch(send(replyToMessage.conversationId, transientChatMessage));
  };

export const readConversation =
  (conversationId: number): AppThunk =>
  (dispatch, getState) => {
    try {
      const state = getState();
      const currentUser = state.user.profile!;
      const conversation = state.chat.conversationState.openConversations.find(
        (openConversation) => openConversation.conversation?.id === conversationId,
      )!.conversation;

      if (conversation && conversation.isReadByUser(currentUser)) {
        return;
      }

      markConversationAsRead(conversationId);
      dispatch(markPreviewConversationAsRead({ conversationId, user: currentUser }));
      dispatch(markOpenConversationAsRead({ conversationId, user: currentUser }));
      dispatch(subtractUnreadCount());
    } catch (error: unknown) {}
  };

export const getLatestConversationsState = (): AppThunk => async (dispatch, getState) => {
  try {
    await Promise.all([dispatch(getLatestConversation()), dispatch(getLatestMessages())]);
  } catch (error: unknown) {
    dispatch(setSyncError('Failed to get latest message. Please refresh page.'));
  }
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
  dispatch(countLatestUnread(latestConversations));
  dispatch(addLatestPreviewConversations(latestConversations));
  dispatch(updateOpenConversation());
};

const countLatestUnread =
  (latestConversations: ChatConversation[]): AppThunk =>
  (dispatch, getState) => {
    const state = getState();
    const previewConversations =
      state.chat.conversationState.previewConversations.conversations;
    const currentUser = state.user.profile!;
    const countReset = state.chat.unreadConversationsCount === 0;

    dispatch(
      addUnreadCount(
        latestConversations.filter((latestConversation) => {
          const currentConversation = previewConversations.find(
            (conversation) => latestConversation.id === conversation.id,
          );

          if (currentConversation == null) {
            return true;
          }

          if (!countReset) {
            return (
              currentConversation.isReadByUser(currentUser) &&
              !latestConversation.isReadByUser(currentUser)
            );
          }

          return !latestConversation.isReadByUser(currentUser);
        }).length,
      ),
    );
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
    const state = getState();
    const chatState = state.chat;
    const opensConversations = chatState.conversationState.openConversations.map(
      (openConversation) => openConversation.conversation,
    );
    let oldestMessageId: number = Number.MAX_VALUE;
    let latestMessageId: number = -1;

    opensConversations.forEach((conversation) => {
      if (conversation == null) {
        return;
      }

      chatState.messageState[conversation.id].messages.forEach((message) => {
        oldestMessageId = Math.min(oldestMessageId, message.id);
        latestMessageId = Math.max(latestMessageId, message.id);
      });
    });

    if (latestMessageId === -1) {
      return;
    }

    const possiblyUpdatedMessages = await getAllMessagesInRange(
      oldestMessageId,
      latestMessageId,
    );
    dispatch(syncMessages(possiblyUpdatedMessages));
  } catch (error: unknown) {
    dispatch(setSyncError('Failed to get latest message. Please refresh page.'));
  }
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
  async (dispatch, getState) => {
    try {
      dispatch(removeMessage({ conversationId, messageId }));
      await removeChatMessage(messageId);
    } catch (error: unknown) {}
  };

export const fetchAllMessageUpToId =
  (id: number, conversationId: number): AppThunk =>
  async (dispatch, getState) => {
    const state = getState().chat;
    let minId = Number.MAX_VALUE;

    state.messageState[conversationId].messages.forEach((message) => {
      minId = Math.min(minId, message.id);
    });

    if (id >= minId) {
      return;
    }
    try {
      dispatch(setMessageIsLoading({ conversationId, isLoading: true }));
      const messages = await getConversationMessagesInRange(conversationId, id, minId);
      dispatch(addMessages({ conversationId, messages }));
      const totalMessages = getState().chat.messageState[conversationId].messages.length;
      const haveAllMessagesInThisPage = totalMessages % Constant.PageSize === 0;

      //  We need to -1 here because we haven't
      //  had all messages for current page and when user scroll to the end
      //  we need to continue fetch all messages of this page (page + 1 - 1 = page)
      const currentPage =
        Math.floor(totalMessages / Constant.PageSize) +
        (haveAllMessagesInThisPage ? 0 : -1);
      dispatch(
        setMessagesPagination({
          conversationId,
          pagination: {
            isLast: false,
            page: currentPage,
            size: Constant.PageSize as number,
          },
        }),
      );
      dispatch(setMessageIsLoading({ conversationId, isLoading: false }));
    } catch (error: unknown) {
      dispatch(setMessageIsLoading({ conversationId, isLoading: false }));
    }
  };
