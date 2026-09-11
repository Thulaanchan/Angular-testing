export interface ResetPasswordRequestDto {
  email: string;
  token: string;
  newPassword: string;
  confirmNewPassword?: string;
}
