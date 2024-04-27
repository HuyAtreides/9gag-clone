import AppComment from '../../models/comment';
import CommentDto from '../dtos/comment-dto';
import { UserMapper } from './user-mapper';

export namespace CommentMapper {
  export function fromDto(commentDto: CommentDto): AppComment {
    return new AppComment({
      ...commentDto,
      user: UserMapper.fromDto(commentDto.user),
      replyTo: commentDto.replyTo ? UserMapper.fromDto(commentDto.replyTo) : null,
      date: new Date(commentDto.date),
      nsfw: commentDto.nsfw,
    });
  }
}
