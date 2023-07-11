import NewPostDto from './new-post-dto';

export interface SharePostRequestDto extends Pick<NewPostDto, 'section' | 'title'> {
  readonly sharedPostId: number;
}
