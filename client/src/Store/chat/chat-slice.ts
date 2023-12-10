import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import ChatConversation from '../../models/chat-conversation';
import ChatMessage from '../../models/chat-message';
import { Constant } from '../../models/enums/constant';
import { Pagination } from '../../models/page';
import Slice from '../../models/slice';

interface MessageState {
  readonly isGettingPage: boolean;
  readonly isLoading: boolean;
  readonly pagination: Pagination;
  readonly sending: boolean;
  readonly sent: boolean;
  readonly gettingPageError: string | null;
  readonly sendingError: string | null;
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

interface PreviewChatConversationState {
  readonly isGettingPage: boolean;
  readonly isLoading: boolean;
  readonly conversations: readonly ChatConversation[];
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
  readonly conversationError: Readonly<Record<number, string | null>>;
  readonly conversationState: ConversationState;
}

const initialState: ChatState = {
  messageState: {},
  conversationError: {},
  conversationState: {
    error: null,
    isGettingConversations: false,
    isLoading: false,
    openConversations: [],
    previewConversations: {
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
    pagination: {
      page: -1,
      size: Constant.PageSize as number,
      isLast: false,
    },
    sending: false,
    sent: false,
    sendingError: null,
    gettingPageError: null,
  };
}

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    openConversation(state, action: PayloadAction<{ index: number; userId: number }>) {
      const { index, userId } = action.payload;
      state.conversationState.openConversations[index] = {
        error: null,
        userId,
        isLoading: true,
        conversation: null,
      };
    },

    setConversation(
      state,
      action: PayloadAction<{
        index: number;
        conversationState: OpenChatConversationState;
      }>,
    ) {
      const { index, conversationState } = action.payload;
      const conversationId = conversationState.conversation?.id;
      state.conversationState.openConversations[index] = conversationState;

      if (conversationId != null) {
        state.messageState[conversationId] = getInitialMessageState();
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
    },

    setPreviewConversationError(state, action: PayloadAction<string | null>) {
      state.conversationState.previewConversations.error = action.payload;
    },

    addPreviewConversationPage(state, action: PayloadAction<Slice<ChatConversation>>) {
      const { page, size, isLast, content } = action.payload;
      state.conversationState.previewConversations.conversations.push(...content);
      state.conversationState.previewConversations.pagination = {
        page,
        size,
        isLast,
      };
    },

    closeConversation(state, action: PayloadAction<number>) {
      const index = action.payload;
      const length = state.conversationState.openConversations.length;

      if (index >= length || index < 0) {
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
      state.messageState[conversationId].messages.unshift(message);
    },

    removeMessage(
      state,
      action: PayloadAction<{ conversationId: number; messageId: number }>,
    ) {
      const { conversationId, messageId } = action.payload;
      const messages = state.messageState[conversationId].messages;
      state.messageState[conversationId].messages = messages.filter(
        (message) => message.id !== messageId,
      );
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
      state.messageState[conversationId].messages.push(...content);
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

    setSendingMessageError(
      state,
      action: PayloadAction<{ conversationId: number; error: string | null }>,
    ) {
      const { conversationId, error } = action.payload;
      state.messageState[conversationId].sendingError = error;
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
  openConversation,
  closeConversation,
  setConversationIsGettingPage,
  setConversationIsLoading,
  setMessageIsGettingPage,
  setMessageIsLoading,
  addConversationPage,
  addMessage,
  addMessagePage,
  setConversations,
  setConversationLoadingError,
  setConversation,
  setPreviewConversationGettingPage,
  setPreviewConversationLoading,
  setPreviewConversations,
  setConversationError,
  setPreviewConversationError,
  addPreviewConversationPage,
  setGetMessagePageError,
  setMessagePage,
  setSendingMessageError,
} = slice.actions;
