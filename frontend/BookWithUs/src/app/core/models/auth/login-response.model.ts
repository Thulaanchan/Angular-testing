export interface AuthResponseDto {
  token: string;
  expiresAt: string;
  userId: number;
  id?: number;
  customerId?: number;
  displayName: string;
  fullName?: string;
  email: string;
  role: string;
}

export type LoginResponseDto = AuthResponseDto;
