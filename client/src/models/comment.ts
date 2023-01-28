import { User } from './user';

interface AppCommentConstructorArguments {
  readonly id: number;

  readonly text: string;

  readonly mediaUrl: string;

  readonly upvotes: number;

  readonly downvotes: number;

  readonly mediaType: string;

  readonly replyTo: User;

  readonly date: string;

  readonly user: User;

  readonly totalChildren: number;

  readonly isUpvoted: boolean;

  readonly isDownvoted: boolean;
}

export default class AppComment {
  readonly id: number;

  readonly text: string;

  readonly mediaUrl: string;

  readonly upvotes: number;

  readonly downvotes: number;

  readonly mediaType: string;

  readonly replyTo: User;

  readonly date: string;

  readonly user: User;

  readonly totalChildren: number;

  readonly isUpvoted: boolean;

  readonly isDownvoted: boolean;

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

    this.totalChildren = comment.totalChildren;

    this.isUpvoted = comment.isUpvoted;

    this.isDownvoted = comment.isDownvoted;
  }
}
