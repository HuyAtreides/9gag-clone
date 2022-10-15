import SliceDto from './slice-dto';

export default interface PageDto<T> extends SliceDto<T> {
  readonly totalElements: number;
  readonly totalPages: number;
}
