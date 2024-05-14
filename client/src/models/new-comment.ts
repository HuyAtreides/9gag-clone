export default interface NewComment {
  readonly text: string | null;

  readonly mediaUrl: string | null;

  readonly mediaType: string | null;

  readonly nsfw: boolean;

  readonly moderating: boolean;
}
