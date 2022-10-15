export default interface SliceDto<T> {
  readonly number: number;
  readonly last: boolean;
  readonly size: number;
  readonly content: readonly T[];
}
