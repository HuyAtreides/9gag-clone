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
  readonly messages: readonly ChatMessage[];
}

interface ConversationState {
  readonly isGettingConversations: boolean;
  readonly isLoading: boolean;
  readonly openConversations: readonly ChatConversation[];
  readonly pagination: Pagination;
  readonly conversations: readonly ChatConversation[];
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
    pagination: {
      page: -1,
      size: Constant.PageSize as number,
      isLast: false,
    },
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
  };
}

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    openConversation(state, action: PayloadAction<number>) {
      const id = action.payload;
      const conversation = state.conversationState.conversations.find(
        (conversation) => conversation.id === id,
      )!;

      state.conversationState.openConversations.push(conversation);
      state.messageState[id] = getInitialMessageState();
    },

    closeConversation(state, action: PayloadAction<number>) {
      const id = action.payload;

      state.conversationState.openConversations =
        state.conversationState.openConversations.filter(
          (conversation) => conversation.id !== id,
        );

      delete state.messageState[id];
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

    setConversationIsLoading(state, action: PayloadAction<boolean>) {
      state.conversationState.isLoading = action.payload;
    },

    setConversationIsGettingPage(state, action: PayloadAction<boolean>) {
      state.conversationState.isGettingConversations = action.payload;
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

    addConversationPage(state, action: PayloadAction<Slice<ChatConversation>>) {
      const { page, size, isLast, content } = action.payload;
      state.conversationState.conversations.push(...content);
      state.conversationState.pagination = {
        page,
        size,
        isLast,
      };
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
  setConversationLoadingError,
} = slice.actions;
