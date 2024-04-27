import { PostContentType } from '../../models/enums/post-content-type';
import SectionDto from './section-dto';
import { UserDto } from './user-dto';

export default interface PostDto {
  readonly id: number;

  readonly title?: string;

  readonly mediaUrl: string;

  readonly mediaType: string;

  readonly downvotes: number;

  readonly upvotes: number;

  readonly section: SectionDto;

  readonly nsfw: boolean;

  /**
   * The upload time of this post in ISO format e.g.2022-07-23T00:42:50Z .
   */
  readonly uploadTime: string;

  readonly tags: string;

  readonly text: string | null;

  readonly contentType: PostContentType;

  readonly isUpvoted: boolean;

  readonly isDownvoted: boolean;

  readonly totalComments: number;

  readonly followed: boolean;

  readonly user?: UserDto;

  readonly isSaved: boolean;

  readonly notificationEnabled: boolean;

  readonly anonymous: boolean;

  readonly sharedPostId: number | null;
}
