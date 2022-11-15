import Section from './section';

export interface UploadPostFormData {
  readonly media: File;
  readonly section: Section;
  readonly tags: string;
  readonly title: string;
}
