import { MessageContent } from '../../models/message-content';
import MessageContentDto from '../dtos/message-content-dto';

export namespace MessageContentMapper {
  export function fromDto(data: MessageContentDto): MessageContent {
    return data;
  }

  export function toDto(data: MessageContent): MessageContentDto {
    return data;
  }
}
