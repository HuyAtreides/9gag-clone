export default interface MessageContentDto {
  readonly mediaUrl: string | null;
  readonly mediaType: string | null;
  readonly text: string | null;
  readonly originalFileName?: string;
}
