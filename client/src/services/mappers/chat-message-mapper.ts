import ChatMessage from '../../models/chat-message';
import ChatMessageDto from '../dtos/chat-message-dto';
import { MessageContentMapper } from './message-content-mapper';
import { UserMapper } from './user-mapper';

export namespace ChatMessageMapper {
  export function fromDto(data: ChatMessageDto): ChatMessage {
    return {
      ...data,
      content: MessageContentMapper.fromDto(data.content),
      sentDate: new Date(data.sentDate),
      lastEditDate: new Date(data.lastEditDate),
      owner: UserMapper.fromDto(data.owner),
    };
  }
}
