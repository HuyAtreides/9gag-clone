import PageOptions from '../../models/page-options';
import PageOptionsDto from '../dtos/page-options-dto';

export namespace PageOptionsMapper {
  export function toDto(data: PageOptions): PageOptionsDto {
    return data;
  }
}
