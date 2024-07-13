export default interface RegisterDataDto {
  readonly username: string;
  readonly password: string;
  readonly displayName: string;
  readonly email?: string;
  readonly country?: string;
}
