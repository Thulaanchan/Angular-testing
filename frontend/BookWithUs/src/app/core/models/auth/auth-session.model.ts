import { AuthUser } from './auth-user.model';

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: string;
}
