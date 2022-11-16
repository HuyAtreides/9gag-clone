import MediaLocation from '../../models/media-location';
import MediaLocationDto from '../dtos/media-location-dto';

export namespace MediaLocationMapper {
  export function fromDto(data: MediaLocationDto): MediaLocation {
    return data;
  }
}
