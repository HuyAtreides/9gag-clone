import { MessageContent } from './message-content';

export default interface NewChatMessageData {
  readonly sentDate: Date;
  readonly content: MessageContent;
}
