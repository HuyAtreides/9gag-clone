import Section from './section';

export default interface NewPostFormData {
  readonly title: string;
  readonly tags: string;
  readonly media: File;
  readonly section: Section;
}
