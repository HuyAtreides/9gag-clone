import MessageContentDto from './message-content-dto';

export default interface NewChatMessageDataDto {
  readonly sentDate: string;
  readonly content: MessageContentDto;
}
