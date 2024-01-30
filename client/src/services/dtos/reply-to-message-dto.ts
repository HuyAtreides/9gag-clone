import MessageContentDto from './message-content-dto';

export default interface ReplyToMessageDto {
  readonly id: number;
  readonly content: MessageContentDto;
  readonly deleted: boolean;
}
