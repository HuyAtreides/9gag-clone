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

  readonly totalChildren: number;

  readonly isUpvoted: boolean;

  readonly isDownvoted: boolean;

  readonly parentId: number | null;

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

    this.isDownvoted = comment.isDownvoted;
  }

  public getMediaLocation(): MediaLocation | undefined {
    return this.mediaType && this.mediaUrl
      ? { url: this.mediaUrl, type: this.mediaType }
      : undefined;
  }

  public get isParent(): boolean {
    return this.replyTo === null;
  }
}
