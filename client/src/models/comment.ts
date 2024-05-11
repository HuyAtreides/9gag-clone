import MediaLocation from './media-location';
import { User } from './user';

interface AppCommentConstructorArguments {
  readonly id: number;

  readonly text: string | null;

  readonly mediaUrl: string | null;

  readonly upvotes: number;

  readonly downvotes: number;

  readonly mediaType: string | null;

  readonly replyTo: User | null;

  readonly date: Date;

  readonly user: User;

  readonly totalChildren: number;

  readonly isUpvoted: boolean;

  readonly parentId: number | null;

  readonly isDownvoted: boolean;

  readonly postId: number;

  readonly replyToId: number | null;

  readonly notificationEnabled: boolean;

  readonly followed: boolean;

  readonly nsfw: boolean;
}

export default class AppComment {
  readonly id: number;

  readonly text: string | null;

  readonly mediaUrl: string | null;

  readonly upvotes: number;

  readonly downvotes: number;

  readonly mediaType: string | null;

  readonly replyTo: User | null;

  readonly date: Date;

  readonly user: User;

  readonly notificationEnabled: boolean;

  readonly totalChildren: number;

  readonly isUpvoted: boolean;

  readonly isDownvoted: boolean;

  readonly parentId: number | null;

  readonly postId: number;

  readonly replyToId: number | null;

  readonly followed: boolean;

  readonly nsfw: boolean;

  constructor(comment: AppCommentConstructorArguments) {
    this.id = comment.id;
    this.replyTo = comment.replyTo;

    this.text = comment.text;

    this.mediaUrl = comment.mediaUrl;

    this.upvotes = comment.upvotes;

    this.downvotes = comment.downvotes;

    this.mediaType = comment.mediaType;

    this.replyTo = comment.replyTo;

    this.date = comment.date;

    this.user = comment.user;

    this.parentId = comment.parentId;

    this.totalChildren = comment.totalChildren;

    this.isUpvoted = comment.isUpvoted;

    this.followed = comment.followed;

    this.isDownvoted = comment.isDownvoted;
    this.postId = comment.postId;
    this.replyToId = comment.replyToId;
    this.notificationEnabled = comment.notificationEnabled;
    this.nsfw = comment.nsfw;
  }

  public getMediaLocation(): MediaLocation | undefined {
    return this.mediaType && this.mediaUrl
      ? { url: this.mediaUrl, type: this.mediaType, nsfw: false, moderating: false }
      : undefined;
  }

  public get isParent(): boolean {
    return this.replyTo === null;
  }
}
