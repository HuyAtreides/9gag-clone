import { UserDto } from './user-dto';

interface ConversationReadStatusDto {
  readonly readBy: UserDto;
  readonly readAt: string;
  readonly latestMessagesRead: boolean;
}

export interface ChatConversationDto {
  readonly muted: boolean;
  readonly id: number;
  readonly participants: readonly UserDto[];
  readonly read: boolean;
  readonly created: Date;
  readonly latestChatMessageId: number;
  readonly readStatuses: readonly ConversationReadStatusDto[];
}
