import Slice from '../../models/slice';
import SliceDto from '../dtos/slice-dto';
import { MapperFromDtoFunc } from './mapper';

export namespace SliceMapper {
  export function fromDto<T, TDto>(
    data: SliceDto<T>,
    mapfromDto: MapperFromDtoFunc<T, TDto>,
  ): Slice<TDto> {
    return {
      isLast: data.last,
      page: data.number,
      size: data.size,
      content: data.content.map((value) => mapfromDto(value)),
    };
  }
}
