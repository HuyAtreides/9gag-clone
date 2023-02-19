import { SortType } from './enums/sort-type';

export default interface PageOptions {
  readonly page: number;
  readonly size: number;
  readonly search?: string;
  readonly sortType?: SortType;
}
