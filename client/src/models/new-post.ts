import Section from './section';

export default interface NewPost {
  readonly title: string;

  readonly mediaUrl: string;

  readonly mediaType: string;

  readonly section: Section;

  readonly tags: String;
}
