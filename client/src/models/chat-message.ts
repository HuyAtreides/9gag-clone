import { MessageContent } from './message-content';
import { User } from './user';

export default interface ChatMessage {
  readonly id: number;
  readonly content: MessageContent;
  readonly lastEditDate: Date;
  readonly sentDate: Date;
  readonly pinned: boolean;
  readonly edited: boolean;
  readonly owner: User;
}
