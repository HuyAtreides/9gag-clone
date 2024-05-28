export default interface MediaLocationDto {
  readonly url: string;

  readonly type: string;

  readonly nsfw: boolean;

  readonly moderating: boolean;
}
