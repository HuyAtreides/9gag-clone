import NewChatMessageData from '../../models/new-chat-message-data';
import NewChatMessageDataDto from '../dtos/new-chat-message-data-dto';
import { MessageContentMapper } from './message-content-mapper';

export namespace NewChatMessageDataMapper {
  export function toDto(data: NewChatMessageData): NewChatMessageDataDto {
    return {
      ...data,
      content: MessageContentMapper.toDto(data.content),
      sentDate: data.sentDate.toISOString(),
    };
  }
}
