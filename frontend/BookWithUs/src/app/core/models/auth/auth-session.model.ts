import { AuthUser } from './auth-user.model';

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

export interface JwtPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  nameid?: string;
  sub?: string;
  email?: string;
  name?: string;
  role?: string;
  jti?: string;
  exp?: number;
  nbf?: number;
  iss?: string;
  aud?: string;
  [key: string]: any;
}

