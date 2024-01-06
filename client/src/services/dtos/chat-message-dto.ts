import MessageContentDto from './message-content-dto';
import ReplyToMessageDto from './reply-to-message-dto';
import { UserDto } from './user-dto';

export default interface ChatMessageDto {
  readonly id: number;
  readonly content: MessageContentDto;
  readonly lastEditDate: string;
  readonly sentDate: string;
  readonly pinned: boolean;
  readonly edited: boolean;
  readonly owner: UserDto;
  readonly deleted: boolean;
  readonly conversationId: number;
  readonly replyToMessage?: ReplyToMessageDto;
}
