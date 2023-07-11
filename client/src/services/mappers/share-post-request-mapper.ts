import { SharePostRequest } from '../../models/share-post-request';
import { SharePostRequestDto } from '../dtos/share-post-request-dto';

export namespace SharePostRequestMapper {
  export function toDto(data: SharePostRequest): SharePostRequestDto {
    return data;
  }
}
