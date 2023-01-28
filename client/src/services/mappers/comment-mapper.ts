import AppComment from '../../models/comment';
import CommentDto from '../dtos/comment-dto';
import { UserMapper } from './user-mapper';

export namespace CommentMapper {
  export function fromDto(commentDto: CommentDto): AppComment {
    return {
      ...commentDto,
      user: UserMapper.fromDto(commentDto.user),
      replyTo: UserMapper.fromDto(commentDto.replyTo),
    };
  }
}
