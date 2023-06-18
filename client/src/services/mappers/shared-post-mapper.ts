import { SharedPost } from '../../models/shared-post';
import { SharedPostDto } from '../dtos/shared-post-dto';
import { SectionMapper } from './section-mapper';
import { UserMapper } from './user-mapper';

export namespace SharedPostMapper {
  export function fromDto(data: SharedPostDto): SharedPost {
    return {
      ...data,
      uploadTime: new Date(data.uploadTime),
      section: SectionMapper.fromDto(data.section),
      user: data.originalPoster
        ? UserMapper.fromDto(data.originalPoster)
        : data.originalPoster,
    };
  }
}
