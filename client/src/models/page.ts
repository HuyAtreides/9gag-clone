import Slice from './slice';

export default interface Page<T> extends Slice<T> {
  readonly totalElements: number;
  readonly totalPages: number;
}

export type Pagination = Omit<Page<any>, 'content'> | Omit<Slice<any>, 'content'>;
