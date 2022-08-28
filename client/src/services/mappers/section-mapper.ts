import Section from '../../models/section';
import SectionDto from '../dtos/section-dto';

export namespace SectionMapper {
  export function toDto(data: Section): SectionDto {
    return data;
  }
}