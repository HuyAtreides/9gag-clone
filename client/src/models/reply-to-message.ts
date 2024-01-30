import { MessageContent } from './message-content';

export default interface ReplyToMessage {
  readonly id: number;
  readonly content: MessageContent;
  readonly deleted: boolean;
}
