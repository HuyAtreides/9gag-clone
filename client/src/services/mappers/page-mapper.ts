import Page from '../../models/page';
import PageDto from '../dtos/page-dto';
import { MapperFromDtoFunc } from './mapper';
import { SliceMapper } from './slice-mapper';

export namespace PageMapper {
  export function fromDto<T, TDto>(
    data: PageDto<T>,
    mapfromDto: MapperFromDtoFunc<T, TDto>,
  ): Page<TDto> {
    return {
      ...SliceMapper.fromDto(data, mapfromDto),
      totalElements: data.totalElements,
      totalPages: data.totalPages,
    };
  }
}
