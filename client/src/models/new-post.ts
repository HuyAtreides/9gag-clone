import { PostContentType } from './enums/post-content-type';
import Section from './section';

export default interface NewPost {
  readonly title?: string;

  readonly mediaUrl: string | null;

  readonly mediaType: string | null;

  readonly section: Section;

  readonly tags: string;

  readonly text: string | null;

  readonly contentType: PostContentType;

  readonly anonymous: boolean;

  readonly notificationEnabled: boolean;

  readonly nsfw: boolean;

  readonly moderating: boolean;
}
