import { AxiosRequestConfig } from 'axios';
import { Constant } from '../models/enums/constant';
import { MessageContent } from '../models/message-content';
import { PageFetchingRequest } from '../models/requests/page-fetching-request';
import { createAxiosInstance } from '../utils/create-axios-instance';
import { ChatConversationDto } from './dtos/chat-conversation-dto';
import ChatMessageDto from './dtos/chat-message-dto';
import SliceDto from './dtos/slice-dto';
import { ChatConversationMapper } from './mappers/chat-conversation-mapper';
import { ChatMessageMapper } from './mappers/chat-message-mapper';
import { MessageContentMapper } from './mappers/message-content-mapper';
import { PageOptionsMapper } from './mappers/page-options-mapper';
import { SliceMapper } from './mappers/slice-mapper';
import MessageContentDto from './dtos/message-content-dto';
import { ConversationMessagesFetchingRequest } from '../models/requests/conversation-messages-fetching-request';
import ChatMessage from '../models/chat-message';
import ChatConversation from '../models/chat-conversation';
import Slice from '../models/slice';

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

export async function sendMessage(conversationId: number, content: MessageContent) {
  const axios = createAxiosInstance();
  const contentDto = MessageContentMapper.toDto(content);

  const response = await axios.post<ChatMessageDto>(
    `${Constant.ChatEndPoint}/add-message/${conversationId}`,
    contentDto,
  );

  return ChatMessageMapper.fromDto(response.data);
}

export async function getConversations(pageRequest: PageFetchingRequest) {
  const axios = createAxiosInstance();
  const pageOptionsDto = PageOptionsMapper.toDto(pageRequest.pageOptions);
  const axiosRequestConfig: AxiosRequestConfig = {
    params: pageOptionsDto,
  };

  const response = await axios.get<SliceDto<ChatConversationDto>>(
    `${Constant.ChatEndPoint}/conversations`,
    axiosRequestConfig,
  );

  return SliceMapper.fromDto(response.data, ChatConversationMapper.fromDto);
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
