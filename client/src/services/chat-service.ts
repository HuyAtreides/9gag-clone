import { Constant } from '../models/enums/constant';
import { createAxiosInstance } from '../utils/create-axios-instance';
import { ChatConversationDto } from './dtos/chat-conversation-dto';
import { ChatConversationMapper } from './mappers/chat-conversation-mapper';

export async function createConversationWithUser(userId: number) {
  const axios = createAxiosInstance();
  const response = await axios.put<ChatConversationDto>(
    `${Constant.ChatEndPoint}/create/${userId}`,
  );

  return ChatConversationMapper.fromDto(response.data);
}
