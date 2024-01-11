import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import ChatConversation from '../../models/chat-conversation';
import ChatMessage from '../../models/chat-message';
import { Constant } from '../../models/enums/constant';
import { MessageContent } from '../../models/message-content';
import { Pagination } from '../../models/page';
import Slice from '../../models/slice';
import { User } from '../../models/user';
import { merge2SortedList } from '../../utils/list-utils';

interface MessageState {
  readonly isGettingPage: boolean;
  readonly isLoading: boolean;
  readonly pagination: Pagination;
  readonly sendingIds: number[];
  readonly sent: boolean;
  readonly gettingPageError: string | null;
  readonly sendingError: Readonly<Record<number, string | null>>;
  readonly replyingToMessage: ChatMessage | null;
  readonly messages: ChatMessage[];
}

const initialPagination = {
  page: -1,
  size: Constant.PageSize as number,
  isLast: false,
};

interface OpenChatConversationState {
  readonly conversation: ChatConversation | null;
  readonly userId: number;
  readonly isLoading: boolean;
  readonly error: string | null;
}

interface PreviewMessageState {
  readonly loading: boolean;
  readonly message: ChatMessage | null;
  readonly error: string | null;
}

interface PreviewChatConversationState {
  readonly isGettingPage: boolean;
  readonly isLoading: boolean;
  readonly previewMessages: Readonly<Record<number, PreviewMessageState>>;
  readonly conversations: readonly ChatConversation[];
  readonly error: string | null;
  readonly pagination: Pagination;
}

interface PinnedMessagesState {
  readonly isGettingPage: boolean;
  readonly isLoading: boolean;
  readonly messages: readonly ChatMessage[];
  readonly error: string | null;
  readonly pagination: Pagination;
}

interface ConversationState {
  readonly isGettingConversations: boolean;
  readonly isLoading: boolean;
  readonly openConversations: readonly OpenChatConversationState[];
  readonly previewConversations: PreviewChatConversationState;
  readonly pagination: Pagination;
  readonly conversations: ChatConversation[];
  readonly error: string | null;
}

interface ChatState {
  readonly messageState: Readonly<Record<number, MessageState>>;
  readonly pinnedMessageState: PinnedMessagesState;
  readonly conversationError: Readonly<Record<number, string | null>>;
  readonly conversationState: ConversationState;
  readonly syncError: string | null;
  readonly unreadConversationsCount: number;
}

const initialState: ChatState = {
  unreadConversationsCount: 0,
  messageState: {},
  conversationError: {},
  syncError: null,
  pinnedMessageState: {
    error: null,
    isLoading: false,
    isGettingPage: false,
    messages: [],
    pagination: initialPagination,
  },
  conversationState: {
    error: null,
    isGettingConversations: false,
    isLoading: false,
    openConversations: [],
    previewConversations: {
      previewMessages: {},
      isLoading: false,
      isGettingPage: false,
      error: null,
      pagination: initialPagination,
      conversations: [],
    },
    pagination: initialPagination,
    conversations: [],
  },
};

function getInitialMessageState() {
  return {
    isGettingPage: false,
    isLoading: false,
    messages: [],
    sent: true,
    pagination: {
      page: -1,
      size: Constant.PageSize as number,
      isLast: false,
    },
    replyingToMessage: null,
    sendingIds: [],
    sendingError: {},
    gettingPageError: null,
  };
}

function getInitialPreviewMessageState() {
  return {
    loading: true,
    message: null,
    error: null,
  };
}

const chatMessageComparator = (a: ChatMessage, b: ChatMessage) => {
  return a.sentDate.getTime() - b.sentDate.getTime() === 0
    ? a.id - b.id
    : a.sentDate.getTime() - b.sentDate.getTime();
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetState() {
      return initialState;
    },

    setPinnedMessageIsLoading(state, action: PayloadAction<boolean>) {
      state.pinnedMessageState.isLoading = action.payload;
    },

    setPinnedMessageIsGettingPage(state, action: PayloadAction<boolean>) {
      state.pinnedMessageState.isGettingPage = action.payload;
    },

    setPinnedMessagesPage(state, action: PayloadAction<Slice<ChatMessage>>) {
      const { page, isLast, size, content } = action.payload;
      state.pinnedMessageState.pagination = { page, isLast, size };
      state.pinnedMessageState.messages = [...content];
    },

    addPinnedMessagesPage(state, action: PayloadAction<Slice<ChatMessage>>) {
      const { page, isLast, size, content } = action.payload;
      state.pinnedMessageState.pagination = { page, isLast, size };
      state.pinnedMessageState.messages.push(...content);
    },

    setPinnedMessageError(state, action: PayloadAction<string | null>) {
      state.pinnedMessageState.error = action.payload;
    },

    resetPinnedMessagesState(state) {
      state.pinnedMessageState = {
        error: null,
        isLoading: false,
        isGettingPage: false,
        messages: [],
        pagination: initialPagination,
      };
    },

    setReplyingToMessage(
      state,
      action: PayloadAction<{ conversationId: number; message: ChatMessage | null }>,
    ) {
      const { conversationId, message } = action.payload;
      state.messageState[conversationId].replyingToMessage = message;
    },

    setMessagePinned(
      state,
      action: PayloadAction<{
        conversationId: number;
        messageId: number;
        pinned: boolean;
      }>,
    ) {
      const { conversationId, messageId, pinned } = action.payload;
      const message = state.messageState[conversationId].messages.find(
        (message) => message.id === messageId,
      );

      if (message) {
        message.pinned = pinned;
      }
    },

    setSyncError(state, action: PayloadAction<string | null>) {
      state.syncError = action.payload;
    },

    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadConversationsCount = action.payload;
    },

    addUnreadCount(state, action: PayloadAction<number>) {
      state.unreadConversationsCount += action.payload < 0 ? 0 : action.payload;
    },

    subtractUnreadCount(state, _: PayloadAction<void>) {
      if (state.unreadConversationsCount > 0) {
        state.unreadConversationsCount--;
      }
    },

    increaseUnreadCount(state, _: PayloadAction<void>) {
      state.unreadConversationsCount++;
    },

    openConversation(state, action: PayloadAction<{ index: number; userId: number }>) {
      const { index, userId } = action.payload;
      state.conversationState.openConversations[index] = {
        error: null,
        userId,
        isLoading: true,
        conversation: null,
      };
    },

    setConversation(state, action: PayloadAction<OpenChatConversationState>) {
      const conversationState = action.payload;
      const index = state.conversationState.openConversations.findIndex(
        (openConversation) => openConversation.userId === conversationState.userId,
      );

      if (index === -1) {
        return;
      }

      const conversationId = conversationState.conversation?.id;
      state.conversationState.openConversations[index] = conversationState;

      if (conversationId != null) {
        state.messageState[conversationId] = getInitialMessageState();
      }
    },

    markPreviewConversationAsRead(
      state,
      action: PayloadAction<{ conversationId: number; user: User }>,
    ) {
      const { conversationId, user } = action.payload;
      const conversations = state.conversationState.previewConversations.conversations;
      const index = conversations.findIndex(
        (conversation) => conversation.id === conversationId,
      );
      const conversation = conversations[index];
      conversation.markRead(user);

      if (index !== -1) {
        conversations[index] = new ChatConversation({
          ...conversation,
        });
      }
    },

    markOpenConversationAsRead(
      state,
      action: PayloadAction<{ conversationId: number; user: User }>,
    ) {
      const { conversationId, user } = action.payload;
      const openConversations = state.conversationState.openConversations;
      const index = openConversations.findIndex(
        (openConversation) => openConversation.conversation?.id === conversationId,
      );

      if (index === -1) {
        return;
      }

      const conversation = openConversations[index].conversation;

      if (conversation) {
        conversation.markRead(user);
        openConversations[index].conversation = new ChatConversation({
          ...conversation,
        });
      }
    },

    updateConversation(state, action: PayloadAction<ChatConversation>) {
      const updateConversation = action.payload;
      const index = state.conversationState.openConversations.findIndex(
        (openConversation) => openConversation.conversation?.id === updateConversation.id,
      );

      if (index !== -1) {
        state.conversationState.openConversations[index].conversation =
          updateConversation;
      }
    },

    setPreviewConversationLoading(state, action: PayloadAction<boolean>) {
      state.conversationState.previewConversations.isLoading = action.payload;
    },

    setPreviewConversationGettingPage(state, action: PayloadAction<boolean>) {
      state.conversationState.previewConversations.isGettingPage = action.payload;
    },

    setPreviewConversations(state, action: PayloadAction<Slice<ChatConversation>>) {
      const { page, size, isLast, content } = action.payload;
      state.conversationState.previewConversations.conversations = [...content];
      state.conversationState.previewConversations.pagination = {
        page,
        size,
        isLast,
      };
      content.forEach((conversation) => {
        if (
          !state.conversationState.previewConversations.previewMessages[conversation.id]
        ) {
          state.conversationState.previewConversations.previewMessages[conversation.id] =
            getInitialPreviewMessageState();
        }
      });
    },

    setPreviewChatMessage(
      state,
      action: PayloadAction<{
        conversationId: number;
        messageState: PreviewMessageState;
      }>,
    ) {
      const { conversationId, messageState } = action.payload;
      state.conversationState.previewConversations.previewMessages[conversationId] =
        messageState;
    },

    setPreviewConversationError(state, action: PayloadAction<string | null>) {
      state.conversationState.previewConversations.error = action.payload;
    },

    addPreviewConversationPage(state, action: PayloadAction<Slice<ChatConversation>>) {
      const { page, size, isLast, content } = action.payload;
      const currentPreviewConversations =
        state.conversationState.previewConversations.conversations;
      state.conversationState.previewConversations.conversations = merge2SortedList(
        currentPreviewConversations,
        [...content],
        (a, b) => (a.id === b.id ? 0 : a.latestChatMessageId - b.latestChatMessageId),
      );
      state.conversationState.previewConversations.pagination = {
        page,
        size,
        isLast,
      };
      content.forEach((conversation) => {
        if (
          !state.conversationState.previewConversations.previewMessages[conversation.id]
        ) {
          state.conversationState.previewConversations.previewMessages[conversation.id] =
            getInitialPreviewMessageState();
        }
      });
    },

    addLatestPreviewConversations(state, action: PayloadAction<ChatConversation[]>) {
      const currentPreviewConversations =
        state.conversationState.previewConversations.conversations;
      state.conversationState.previewConversations.conversations = [
        ...action.payload,
        ...currentPreviewConversations.filter((conversation) =>
          action.payload.every((latest) => latest.id !== conversation.id),
        ),
      ];
      action.payload.forEach((conversation) => {
        if (
          !state.conversationState.previewConversations.previewMessages[conversation.id]
        ) {
          state.conversationState.previewConversations.previewMessages[conversation.id] =
            getInitialPreviewMessageState();
        }
      });
    },

    closeConversation(state, action: PayloadAction<number>) {
      const userId = action.payload;
      const index = state.conversationState.openConversations.findIndex(
        (conversation) => conversation.userId === userId,
      );

      if (index === -1) {
        return;
      }

      const openConversationState = state.conversationState.openConversations[index];
      const conversationId = openConversationState.conversation?.id;
      state.conversationState.openConversations.splice(index, 1);

      if (conversationId != null) {
        delete state.messageState[conversationId];
      }
    },

    setConversationError(
      state,
      action: PayloadAction<{ conversationId: number; error: string | null }>,
    ) {
      const { conversationId, error } = action.payload;
      state.conversationError[conversationId] = error;
    },

    setConversationLoadingError(state, action: PayloadAction<string | null>) {
      state.conversationState.error = action.payload;
    },

    setConversationIsLoading(state, action: PayloadAction<boolean>) {
      state.conversationState.isLoading = action.payload;
    },

    setConversationIsGettingPage(state, action: PayloadAction<boolean>) {
      state.conversationState.isGettingConversations = action.payload;
    },

    addMessage(
      state,
      action: PayloadAction<{ message: ChatMessage; conversationId: number }>,
    ) {
      const { message, conversationId } = action.payload;
      state.messageState[conversationId].messages = merge2SortedList(
        state.messageState[conversationId].messages,
        [message],
        chatMessageComparator,
      );
    },

    addMessages(
      state,
      action: PayloadAction<{ messages: ChatMessage[]; conversationId: number }>,
    ) {
      const { messages, conversationId } = action.payload;
      state.messageState[conversationId].messages = merge2SortedList(
        state.messageState[conversationId].messages,
        messages,
        chatMessageComparator,
      );
    },

    markMessagePageAsLast(state, action: PayloadAction<number>) {
      const conversationId = action.payload;
      state.messageState[conversationId].pagination.isLast = true;
    },

    setMessagesPagination(
      state,
      action: PayloadAction<{ conversationId: number; pagination: Pagination }>,
    ) {
      const { conversationId, pagination } = action.payload;
      state.messageState[conversationId].pagination = pagination;
    },

    addLatestMessages(state, action: PayloadAction<ChatMessage[]>) {
      const messages = action.payload;
      messages.forEach((message) => {
        const conversationId = message.conversationId;
        state.messageState[conversationId].messages = merge2SortedList(
          state.messageState[conversationId].messages,
          [message],
          chatMessageComparator,
        );
      });
    },

    syncMessages(state, action: PayloadAction<ChatMessage[]>) {
      const latestMessages = action.payload;
      latestMessages
        .filter((message) => state.messageState[message.conversationId] != null)
        .forEach((latestMessage) => {
          const conversationId = latestMessage.conversationId;
          const index = state.messageState[conversationId].messages.findIndex(
            (message) => message.id === latestMessage.id,
          );

          if (index === -1) {
            return;
          }

          state.messageState[conversationId].messages[index] = latestMessage;
        });
    },

    removeMessage(
      state,
      action: PayloadAction<{ conversationId: number; messageId: number }>,
    ) {
      const { conversationId, messageId } = action.payload;
      const messages = state.messageState[conversationId].messages;
      const deletedMessage = messages.find((message) => message.id === messageId);

      if (deletedMessage) {
        deletedMessage.deleted = true;
      }
    },

    updateMessage(
      state,
      action: PayloadAction<{
        conversationId: number;
        messageId: number;
        content: MessageContent;
      }>,
    ) {
      const { conversationId, messageId, content } = action.payload;
      const messages = state.messageState[conversationId].messages;
      const updatedMessage = messages.find((message) => message.id === messageId);

      if (updatedMessage) {
        updatedMessage.content = content;
        updatedMessage.edited = true;
      }
    },

    setMessageIsLoading(
      state,
      action: PayloadAction<{ conversationId: number; isLoading: boolean }>,
    ) {
      const { conversationId, isLoading } = action.payload;
      state.messageState[conversationId].isLoading = isLoading;
    },

    setMessageIsGettingPage(
      state,
      action: PayloadAction<{ conversationId: number; isGettingPage: boolean }>,
    ) {
      const { conversationId, isGettingPage } = action.payload;
      state.messageState[conversationId].isGettingPage = isGettingPage;
    },

    addMessagePage(
      state,
      action: PayloadAction<{ conversationId: number; slice: Slice<ChatMessage> }>,
    ) {
      const { conversationId, slice } = action.payload;
      const { page, size, isLast, content } = slice;
      const currentMessages = state.messageState[conversationId].messages;
      state.messageState[conversationId].messages = merge2SortedList(
        currentMessages,
        [...content],
        chatMessageComparator,
      );
      state.messageState[conversationId].pagination = {
        page,
        size,
        isLast,
      };
    },

    setMessagePage(
      state,
      action: PayloadAction<{ conversationId: number; slice: Slice<ChatMessage> }>,
    ) {
      const { conversationId, slice } = action.payload;
      const { page, size, isLast, content } = slice;
      state.messageState[conversationId].messages = [...content];
      state.messageState[conversationId].pagination = {
        page,
        size,
        isLast,
      };
    },

    setGetMessagePageError(
      state,
      action: PayloadAction<{ conversationId: number; error: string | null }>,
    ) {
      const { conversationId, error } = action.payload;
      state.messageState[conversationId].gettingPageError = error;
    },

    addIsSendingId(state, action: PayloadAction<{ conversationId: number; id: number }>) {
      const { conversationId, id } = action.payload;
      state.messageState[conversationId].sendingIds.push(id);
      state.messageState[conversationId].sent = false;
    },

    removeIsSendingId(
      state,
      action: PayloadAction<{ conversationId: number; id: number }>,
    ) {
      const { conversationId, id } = action.payload;
      const sendingIds = state.messageState[conversationId].sendingIds;
      const index = sendingIds.findIndex((sendingId) => sendingId === id);
      sendingIds.splice(index, 1);

      if (sendingIds.length === 0) {
        state.messageState[conversationId].sent = true;
      }
    },

    resetIsSendingIds(state, action: PayloadAction<number>) {
      const conversationId = action.payload;
      state.messageState[conversationId].sendingIds = [];
    },

    setPersistedMessage(
      state,
      action: PayloadAction<{
        conversationId: number;
        transientId: number;
        chatMessage: ChatMessage;
      }>,
    ) {
      const { conversationId, transientId, chatMessage } = action.payload;
      const messages = state.messageState[conversationId].messages;
      const transientIndex = messages.findIndex((message) => message.id === transientId);

      if (messages.find((message) => message.id === chatMessage.id)) {
        messages.splice(transientIndex, 1);
        return;
      }

      messages[transientIndex] = chatMessage;
      console.log('persisted messages current', messages);
    },

    setSendingMessageError(
      state,
      action: PayloadAction<{
        conversationId: number;
        messageId: number;
        error: string | null;
      }>,
    ) {
      const { conversationId, error, messageId } = action.payload;
      state.messageState[conversationId].sendingError[messageId] = error;
    },

    setConversations(state, action: PayloadAction<Slice<ChatConversation>>) {
      const { page, size, isLast, content } = action.payload;
      state.conversationState.conversations = [...content];
      state.conversationState.pagination = {
        page,
        size,
        isLast,
      };
    },

    addConversationPage(state, action: PayloadAction<Slice<ChatConversation>>) {
      const { page, size, isLast, content } = action.payload;
      state.conversationState.conversations.push(...content);
      state.conversationState.pagination = {
        page,
        size,
        isLast,
      };
    },
  },
});

export const chatReducer = slice.reducer;
export const {
  setReplyingToMessage,
  setPinnedMessageError,
  setPinnedMessageIsGettingPage,
  setPinnedMessageIsLoading,
  setMessagePinned,
  setPinnedMessagesPage,
  resetPinnedMessagesState,
  addPinnedMessagesPage,
  markOpenConversationAsRead,
  resetState,
  increaseUnreadCount,
  setSyncError,
  setUnreadCount,
  addUnreadCount,
  subtractUnreadCount,
  updateMessage,
  openConversation,
  closeConversation,
  setConversationIsGettingPage,
  setConversationIsLoading,
  setMessageIsGettingPage,
  setMessageIsLoading,
  addConversationPage,
  markPreviewConversationAsRead,
  addMessage,
  addMessagePage,
  setConversations,
  setConversationLoadingError,
  setConversation,
  removeIsSendingId,
  setPreviewConversationGettingPage,
  setPreviewConversationLoading,
  setPreviewConversations,
  setConversationError,
  setPreviewConversationError,
  addPreviewConversationPage,
  setGetMessagePageError,
  setMessagePage,
  setSendingMessageError,
  updateConversation,
  addIsSendingId,
  resetIsSendingIds,
  markMessagePageAsLast,
  addLatestMessages,
  addLatestPreviewConversations,
  setPersistedMessage,
  setPreviewChatMessage,
  removeMessage,
  syncMessages,
  addMessages,
  setMessagesPagination,
} = slice.actions;
