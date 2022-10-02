import Section from './section';

export default interface Post {
  readonly id: number;

  readonly title: string;

  readonly mediaUrl: string;

  readonly mediaType: string;

  readonly downvotes: number;

  readonly upvotes: number;

  readonly section: Section;

  /**
   * The upload time of this post in ISO format e.g.2022-07-23T00:42:50Z .
   */
  readonly uploadTime: Date;

  readonly tags: String;

  readonly totalComments: number;
}
