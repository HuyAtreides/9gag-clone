import NewPost from './new-post';

export interface SharePostRequest extends Pick<NewPost, 'title' | 'section'> {
  readonly sharedPostId: number;
}
