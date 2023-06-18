import PostDto from './post-dto';
import { UserDto } from './user-dto';

export interface SharedPostDto
  extends Pick<
    PostDto,
    | 'id'
    | 'anonymous'
    | 'section'
    | 'uploadTime'
    | 'mediaType'
    | 'mediaUrl'
    | 'contentType'
    | 'title'
    | 'text'
  > {
  readonly originalPoster: UserDto;
}
