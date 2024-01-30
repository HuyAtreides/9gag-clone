import { MessageContent } from './message-content';
import ReplyToMessage from './reply-to-message';
import { User } from './user';

export default interface ChatMessage {
  readonly id: number;
  readonly content: MessageContent;
  readonly lastEditDate: Date;
  readonly sentDate: Date;
  readonly pinned: boolean;
  readonly deleted: boolean;
  readonly conversationId: number;
  readonly edited: boolean;
  readonly owner: User;
  readonly replyToMessage?: ReplyToMessage;
}
