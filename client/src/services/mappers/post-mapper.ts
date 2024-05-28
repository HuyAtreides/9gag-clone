import Post from '../../models/post';
import PostDto from '../dtos/post-dto';
import { SectionMapper } from './section-mapper';
import { UserMapper } from './user-mapper';

export namespace PostMapper {
  export function fromDto(data: PostDto): Post {
    return {
      ...data,
      nsfw: data.nsfw,
      uploadTime: new Date(data.uploadTime),
      section: SectionMapper.fromDto(data.section),
      user: data.user ? UserMapper.fromDto(data.user) : data.user,
      tags: data.tags ? data.tags.split(',').filter((tag) => tag.trim().length > 0) : [],
    };
  }
}
