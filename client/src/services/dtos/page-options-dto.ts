import { SortType } from '../../models/enums/sort-type';

export default interface PageOptionsDto {
  readonly page: number;
  readonly size: number;
  readonly search?: string;
  readonly sortType?: SortType;
}
