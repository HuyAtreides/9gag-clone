export default interface NewCommentDto {
  readonly text: string | null;

  readonly mediaUrl: string | null;

  readonly mediaType: string | null;

  readonly nsfw: boolean;

  readonly moderating: boolean;
}
