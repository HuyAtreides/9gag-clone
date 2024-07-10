export interface ReportUserRequestDto {
  readonly userId: number;

  readonly reason: string;

  readonly contentURL: string;
}
