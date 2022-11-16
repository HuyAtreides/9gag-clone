import NewPost from '../../models/new-post';
import NewPostDto from '../dtos/new-post-dto';

export namespace NewPostMapper {
  export function toDto(data: NewPost): NewPostDto {
    return data;
  }
}
