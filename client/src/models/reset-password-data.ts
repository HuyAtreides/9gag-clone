export interface ResetPasswordData {
  readonly newPassword: string;
  readonly code: string;
  readonly email: string;
}
