export default interface PageOptionsDto {
  readonly page: number;
  readonly size: number;
  readonly search?: string;
}
