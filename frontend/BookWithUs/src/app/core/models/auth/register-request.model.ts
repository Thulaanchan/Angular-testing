export interface RegisterRequestDto {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  password: string;
  confirmPassword?: string;
}
