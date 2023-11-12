import ChatConversation from '../../models/chat-conversation';
import { ChatConversationDto } from '../dtos/chat-conversation-dto';
import { UserMapper } from './user-mapper';

export namespace ChatConversationMapper {
  export function fromDto(data: ChatConversationDto): ChatConversation {
    return {
      ...data,
      participants: data.participants.map((participant) =>
        UserMapper.fromDto(participant),
      ),
      readStatuses: data.readStatuses.map((status) => ({
        ...status,
        readBy: UserMapper.fromDto(status.readBy),
        readAt: new Date(status.readAt),
      })),
    };
  }
}
