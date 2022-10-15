export default interface Slice<T> {
  readonly page: number;
  readonly isLast: boolean;
  readonly size: number;
  readonly content: readonly T[];
}
