import { UserDto } from './user-dto';

export default interface CommentDto {
  readonly id: number;

  readonly text: string;

  readonly mediaUrl: string | null;

  readonly upvotes: number;

  readonly downvotes: number;

  readonly mediaType: string | null;

  readonly replyTo: UserDto | null;

  readonly date: string;

  readonly user: UserDto;

  readonly totalChildren: number;

  readonly isUpvoted: boolean;

  readonly isDownvoted: boolean;

  readonly parentId: number | null;

  readonly postId: number;

  readonly replyToId: number | null;

  readonly notificationEnabled: boolean;

  readonly followed: boolean;

  readonly nsfw: boolean;

  readonly moderating: boolean;
}
