import { AxiosRequestConfig } from 'axios';
import ChatConversation from '../models/chat-conversation';
import ChatMessage from '../models/chat-message';
import { Constant } from '../models/enums/constant';
import NewChatMessageData from '../models/new-chat-message-data';
import { ConversationMessagesFetchingRequest } from '../models/requests/conversation-messages-fetching-request';
import { PageFetchingRequest } from '../models/requests/page-fetching-request';
import Slice from '../models/slice';
import { createAxiosInstance } from '../utils/create-axios-instance';
import { ChatConversationDto } from './dtos/chat-conversation-dto';
import ChatMessageDto from './dtos/chat-message-dto';
import MessageContentDto from './dtos/message-content-dto';
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

export async function editMessage(messageId: number, newContent: MessageContentDto) {
  const axios = createAxiosInstance();
  const newContentDto = MessageContentMapper.toDto(newContent);

  await axios.put<void>(
    `${Constant.ChatEndPoint}/edit-message/${messageId}`,
    newContentDto,
  );
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
