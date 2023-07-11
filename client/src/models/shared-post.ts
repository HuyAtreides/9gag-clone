import Post from './post';

export type SharedPost = Pick<
  Post,
  | 'id'
  | 'anonymous'
  | 'user'
  | 'section'
  | 'uploadTime'
  | 'mediaType'
  | 'mediaUrl'
  | 'contentType'
  | 'title'
  | 'text'
>;
