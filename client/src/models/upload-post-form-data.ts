import { PostContentType } from './enums/post-content-type';
import Section from './section';

export interface UploadPostFormData {
  readonly media?: File;
  readonly section: Section;
  readonly tags: string;
  readonly title: string;
  readonly contentType: PostContentType;
  readonly text?: string;
  readonly anonymous: boolean;
  readonly notificationEnabled: boolean;
}
