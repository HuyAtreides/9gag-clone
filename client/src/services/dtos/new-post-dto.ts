import { PostContentType } from '../../models/enums/post-content-type';

import SectionDto from './section-dto';

export default interface NewPostDto {
  readonly title?: string;

  readonly mediaUrl: string | null;

  readonly mediaType: string | null;

  readonly section: SectionDto;

  readonly tags: string;

  readonly text: string | null;

  readonly contentType: PostContentType;

  readonly anonymous: boolean;

  readonly notificationEnabled: boolean;

  readonly nsfw: boolean;
}
