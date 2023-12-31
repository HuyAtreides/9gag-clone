import { MessageContent } from '../../models/message-content';
import MessageContentDto from '../dtos/message-content-dto';

export namespace MessageContentMapper {
  export function fromDto(data: MessageContentDto): MessageContent {
    let upload = undefined;

    if (data.mediaUrl && data.originalFileName) {
      upload = {
        uid: data.mediaUrl,
        name: data.originalFileName,
      };
    }

    return {
      ...data,
      uploadFile: upload,
    };
  }

  export function toDto(data: MessageContent): MessageContentDto {
    return {
      ...data,
      originalFileName: data.uploadFile?.originFileObj?.name,
    };
  }
}
