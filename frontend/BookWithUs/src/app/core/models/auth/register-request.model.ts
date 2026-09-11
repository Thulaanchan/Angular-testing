export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone?: string | null;
  phoneNumber?: string | null;
  password: string;
  confirmPassword: string;
}
