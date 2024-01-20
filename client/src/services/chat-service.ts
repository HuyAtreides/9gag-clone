import { AxiosRequestConfig } from 'axios';
import ChatConversation from '../models/chat-conversation';
import ChatMessage from '../models/chat-message';
import { Constant } from '../models/enums/constant';
import { MessageContent } from '../models/message-content';
import NewChatMessageData from '../models/new-chat-message-data';
import { ConversationMessagesFetchingRequest } from '../models/requests/conversation-messages-fetching-request';
import { PageFetchingRequest } from '../models/requests/page-fetching-request';
import Slice from '../models/slice';
import { createAxiosInstance } from '../utils/create-axios-instance';
import { ChatConversationDto } from './dtos/chat-conversation-dto';
import ChatMessageDto from './dtos/chat-message-dto';
import SliceDto from './dtos/slice-dto';
import { ChatConversationMapper } from './mappers/chat-conversation-mapper';
import { ChatMessageMapper } from './mappers/chat-message-mapper';
import { MessageContentMapper } from './mappers/message-content-mapper';
import { NewChatMessageDataMapper } from './mappers/new-chat-message-data-mapper';
import { PageOptionsMapper } from './mappers/page-options-mapper';
import { SliceMapper } from './mappers/slice-mapper';

export type FetchChatMessagesPageFunc<T extends PageFetchingRequest> = (
  request: T,
) => Promise<Slice<ChatMessage>>;

export type FetchChatConversationFunc<T extends PageFetchingRequest> = (
  request: T,
) => Promise<Slice<ChatConversation>>;

export async function createConversationWithUser(userId: number) {
  const axios = createAxiosInstance();
  const response = await axios.put<ChatConversationDto>(
    `${Constant.ChatEndPoint}/create/${userId}`,
  );

  return ChatConversationMapper.fromDto(response.data);
}

export async function getMessage(messageId: number) {
  const axios = createAxiosInstance();
  const response = await axios.get<ChatMessageDto>(
    `${Constant.ChatEndPoint}/message/${messageId}`,
  );

  return ChatMessageMapper.fromDto(response.data);
}

export async function getConversationsWithNewestMessage(latestMessageId: number) {
  const axios = createAxiosInstance();
  const response = await axios.get<ChatConversationDto[]>(
    `${Constant.ChatEndPoint}/conversations-with-newest-messages/${latestMessageId}`,
  );

  return response.data.map((conversationDto) =>
    ChatConversationMapper.fromDto(conversationDto),
  );
}

export async function markAllAsRead() {
  const axios = createAxiosInstance();

  await axios.put<void>(`${Constant.ChatEndPoint}/mark-all-as-read`);
}

export async function getAllLatestChatMessage(latestMessageId: number) {
  const axios = createAxiosInstance();
  const response = await axios.get<ChatMessageDto[]>(
    `${Constant.ChatEndPoint}/latest-chat-messages/${latestMessageId}`,
  );

  return response.data.map((messageDto) => ChatMessageMapper.fromDto(messageDto));
}

export async function sendMessage(
  conversationId: number,
  newChatMessageData: NewChatMessageData,
) {
  const axios = createAxiosInstance();
  const newChatMessageDataDto = NewChatMessageDataMapper.toDto(newChatMessageData);

  const response = await axios.post<ChatMessageDto>(
    `${Constant.ChatEndPoint}/add-message/${conversationId}`,
    newChatMessageDataDto,
  );

  return ChatMessageMapper.fromDto(response.data);
}

async function getConversations(pageRequest: PageFetchingRequest, endPoint: string) {
  const axios = createAxiosInstance();
  const pageOptionsDto = PageOptionsMapper.toDto(pageRequest.pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };

  const response = await axios.get<SliceDto<ChatConversationDto>>(
    `${Constant.ChatEndPoint}/${endPoint}`,
    axiosRequestConfig,
  );

  return SliceMapper.fromDto(response.data, ChatConversationMapper.fromDto);
}

export async function getAllConversations(pageRequest: PageFetchingRequest) {
  const conversations = await getConversations(pageRequest, 'conversations');

  return conversations;
}

export async function getNonEmptyConversations(pageRequest: PageFetchingRequest) {
  const conversations = await getConversations(pageRequest, 'non-empty-conversations');

  return conversations;
}

export async function editMessage(messageId: number, newContent: MessageContent) {
  const axios = createAxiosInstance();
  const newContentDto = MessageContentMapper.toDto(newContent);

  await axios.put<void>(
    `${Constant.ChatEndPoint}/edit-message/${messageId}`,
    newContentDto,
  );
}

export async function pinMessage(messageId: number) {
  const axios = createAxiosInstance();
  await axios.put<void>(`${Constant.ChatEndPoint}/message/pin/${messageId}`);
}

export async function unPinMessage(messageId: number) {
  const axios = createAxiosInstance();
  await axios.put<void>(`${Constant.ChatEndPoint}/message/unpin/${messageId}`);
}

export async function muteConversation(conversationId: number) {
  const axios = createAxiosInstance();
  await axios.put<void>(`${Constant.ChatEndPoint}/conversation/mute/${conversationId}`);
}

export async function unMuteConversation(conversationId: number) {
  const axios = createAxiosInstance();
  await axios.put<void>(`${Constant.ChatEndPoint}/conversation/unmute/${conversationId}`);
}

export async function markConversationAsRead(conversationId: number) {
  const axios = createAxiosInstance();
  await axios.put<void>(`${Constant.ChatEndPoint}/mark-as-read/${conversationId}`);
}

export async function getSpecificConversation(id: number) {
  const axios = createAxiosInstance();
  const response = await axios.get<ChatConversationDto>(
    `${Constant.ChatEndPoint}/conversation/${id}`,
  );

  return ChatConversationMapper.fromDto(response.data);
}

export async function getConversationMessages(
  pageRequest: ConversationMessagesFetchingRequest,
) {
  const axios = createAxiosInstance();
  const conversationId = pageRequest.conversationId;
  const pageOptionsDto = PageOptionsMapper.toDto(pageRequest.pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };

  const response = await axios.get<SliceDto<ChatMessageDto>>(
    `${Constant.ChatEndPoint}/messages/${conversationId}`,
    axiosRequestConfig,
  );

  return SliceMapper.fromDto(response.data, ChatMessageMapper.fromDto);
}

export async function getUnreadConversationCount() {
  const axios = createAxiosInstance();
  const response = await axios.get<number>(`${Constant.ChatEndPoint}/count/unread`);

  return response.data;
}

export async function deleteConversation(id: number) {
  const axios = createAxiosInstance();
  await axios.delete<void>(`${Constant.ChatEndPoint}/conversation/${id}`);
}

export async function removeChatMessage(messageId: number) {
  const axios = createAxiosInstance();
  await axios.delete<void>(`${Constant.ChatEndPoint}/message/${messageId}`);
}

export async function getAllMessagesInRange(
  oldestMessageId: number,
  latestMessageId: number,
) {
  const axios = createAxiosInstance();
  const response = await axios.get<ChatMessageDto[]>(
    `${Constant.ChatEndPoint}/all-message/in-range/${oldestMessageId}/${latestMessageId}`,
  );

  return response.data.map((message) => ChatMessageMapper.fromDto(message));
}

export async function getConversationMessagesInRange(
  conversationId: number,
  oldestMessageId: number,
  latestMessageId: number,
) {
  const axios = createAxiosInstance();
  const response = await axios.get<ChatMessageDto[]>(
    `${Constant.ChatEndPoint}/message/${conversationId}/in-range/${oldestMessageId}/${latestMessageId}`,
  );

  return response.data.map((message) => ChatMessageMapper.fromDto(message));
}

export async function getPinnedMessages(
  pageRequest: ConversationMessagesFetchingRequest,
) {
  const axios = createAxiosInstance();
  const conversationId = pageRequest.conversationId;
  const pageOptionsDto = PageOptionsMapper.toDto(pageRequest.pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };
  const response = await axios.get<SliceDto<ChatMessageDto>>(
    `${Constant.ChatEndPoint}/message/pinned/${conversationId}`,
    axiosRequestConfig,
  );

  return SliceMapper.fromDto(response.data, ChatMessageMapper.fromDto);
}

export async function sendReply(
  replyToId: number,
  newChatMessageData: NewChatMessageData,
) {
  const axios = createAxiosInstance();
  const newChatMessageDataDto = NewChatMessageDataMapper.toDto(newChatMessageData);
  const response = await axios.post<ChatMessageDto>(
    `${Constant.ChatEndPoint}/message/reply-to/${replyToId}`,
    newChatMessageDataDto,
  );

  return ChatMessageMapper.fromDto(response.data);
}
