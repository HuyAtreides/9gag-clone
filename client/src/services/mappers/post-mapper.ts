import Post from '../../models/post';
import PostDto from '../dtos/post-dto';
import { SectionMapper } from './section-mapper';

export namespace PostMapper {
  export function fromDto(data: PostDto): Post {
    return {
      ...data,
      uploadTime: new Date(data.uploadTime),
      section: SectionMapper.fromDto(data.section),
    };
  }
}
