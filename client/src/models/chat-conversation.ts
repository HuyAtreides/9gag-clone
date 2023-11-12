import { User } from './user';

interface ConversationReadStatus {
  readonly readBy: User;
  readonly readAt: Date;
  readonly latestReadMessageId: number;
}

export default interface ChatConversation {
  readonly id: number;
  readonly participants: User[];
  readonly read: boolean;
  readonly latestChatMessageId: number;
  readonly readStatuses: ConversationReadStatus[];
}
