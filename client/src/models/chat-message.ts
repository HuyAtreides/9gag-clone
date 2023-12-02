import MessageContentDto from '../services/dtos/message-content-dto';
import { User } from './user';

export default interface ChatMessage {
  readonly id: number;
  readonly content: MessageContentDto;
  readonly lastEditDate: Date;
  readonly sentDate: Date;
  readonly pinned: boolean;
  readonly deleted: boolean;
  readonly conversationId: number;
  readonly edited: boolean;
  readonly owner: User;
}