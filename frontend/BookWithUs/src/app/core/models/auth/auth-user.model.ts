import { AppRole } from './auth-role.model';

export interface AuthUser {
  id: number;
  customerId?: number;
  email: string;
  displayName?: string;
  fullName?: string;
  phoneNumber?: string;
  role: AppRole | string;
  token?: string;
}
