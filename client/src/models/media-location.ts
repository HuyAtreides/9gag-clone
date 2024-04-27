export default interface MediaLocation {
  readonly url: string;

  readonly type: string;

  readonly originalFileName?: string;

  readonly nsfw: boolean;
}
