import Section from '../../models/section';

export default interface NewPostDto {
  readonly title: string;

  readonly mediaUrl: string;

  readonly mediaType: string;

  readonly section: Section;

  readonly tags: String;
}
