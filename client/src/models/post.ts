import { PostContentType } from './enums/post-content-type';
import Section from './section';
import { User } from './user';

export default interface Post {
  readonly id: number;

  readonly title?: string;

  readonly mediaUrl: string;

  readonly mediaType: string;

  readonly downvotes: number;

  readonly upvotes: number;

  readonly section: Section;

  readonly uploadTime: Date;

  readonly followed: boolean;

  readonly tags: string[];

  readonly isUpvoted: boolean;

  readonly text: string | null;

  readonly contentType: PostContentType;

  readonly isDownvoted: boolean;

  readonly totalComments: number;

  readonly user?: User;

  readonly isSaved: boolean;

  readonly notificationEnabled: boolean;

  readonly anonymous: boolean;

  readonly sharedPostId: number | null;

  readonly nsfw: boolean;
}
