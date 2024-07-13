export interface ResetPasswordDataDto {
  readonly newPassword: string;
  readonly code: string;
  readonly email: string;
}
