import { PostContentType } from '../../models/enums/post-content-type';
import Section from '../../models/section';

export default interface NewPostDto {
  readonly title: string;

  readonly mediaUrl: string | null;

  readonly mediaType: string | null;

  readonly section: Section;

  readonly tags: string;

  readonly text: string | null;

  readonly contentType: PostContentType;

  readonly anonymous: boolean;

  readonly notificationEnabled: boolean;
}
