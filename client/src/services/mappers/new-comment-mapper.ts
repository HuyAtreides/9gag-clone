import NewComment from '../../models/new-comment';
import NewCommentDto from '../dtos/new-comment-dto';

export namespace NewCommentMapper {
  export function toDto(newComment: NewComment): NewCommentDto {
    return newComment;
  }
}
