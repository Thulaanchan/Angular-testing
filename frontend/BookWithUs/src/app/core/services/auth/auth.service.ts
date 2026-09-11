import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { LoginRequestDto } from '../../models/auth/login-request.model';
import { LoginResponseDto, AuthResponseDto } from '../../models/auth/login-response.model';
import { RegisterRequestDto } from '../../models/auth/register-request.model';
import { VerifyEmailRequestDto } from '../../models/auth/verify-email-request.model';
import { ResendVerificationRequestDto } from '../../models/auth/resend-verification-request.model';
import { ResetPasswordRequestDto } from '../../models/auth/reset-password-request.model';
import { ForgotPasswordRequestDto } from '../../models/auth/forgot-password-request.model';
import { AuthUser } from '../../models/auth/auth-user.model';
import { JwtPayload } from '../../models/auth/auth-session.model';
import { CustomerDto } from '../../models/customers/customer.model';

const TOKEN_KEY = 'bookwithus_token';
const USER_KEY = 'bookwithus_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.loadStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Rely on stored user token in localStorage
  }

  public get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    return true;
  }

  public isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return !!user && (user.role === 'Administrator' || (user as any).roleName === 'Administrator');
  }

  public isCustomer(): boolean {
    const user = this.currentUserSubject.value;
    return !!user && (user.role === 'Customer' || (user as any).roleName === 'Customer' || !this.isAdmin());
  }

  public getCustomerId(): number | null {
    return this.currentUserSubject.value?.customerId || (this.currentUserSubject.value?.id as number) || null;
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(request: LoginRequestDto): Observable<LoginResponseDto> {
    if (!API_CONFIG.useMockData) {
      const payload: LoginRequestDto = {
        email: request.email.trim(),
        password: request.password,
        rememberMe: !!request.rememberMe
      };
      return this.http.post<AuthResponseDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.auth.login}`, payload).pipe(
        tap(response => this.handleAuthSuccess(response))
      );
    }
    return this.mockLogin(request);
  }

  private mockLogin(request: LoginRequestDto): Observable<LoginResponseDto> {
    const email = request.email.trim().toLowerCase();
    
    // Admin login
    if (email.includes('admin') || email === 'alex@eventflow.com' || email === 'admin@bookwithus.com') {
      const resp: LoginResponseDto = {
        userId: 999,
        displayName: 'Alex Morgan',
        token: 'mock-jwt-token-admin-' + Date.now(),
        role: 'Administrator',
        customerId: 0,
        email: 'alex.morgan@eventflow.com',
        fullName: 'Alex Morgan',
        expiresAt: new Date(Date.now() + 3600000).toISOString()
      };
      this.handleAuthSuccess(resp);
      return of(resp);
    }

    // Invalid credentials check for testing
    if (request.password === 'wrongpassword') {
      return throwError(() => ({
        status: 401,
        error: { message: 'The email or password you entered is incorrect. Please try again.' }
      }));
    }

    // Default Customer login
    const resp: LoginResponseDto = {
      userId: 1,
      displayName: 'Leo Thas',
      token: 'mock-jwt-token-customer-' + Date.now(),
      role: 'Customer',
      customerId: 1,
      email: email || 'leo.thas@email.com',
      fullName: 'Leo Thas',
      expiresAt: new Date(Date.now() + 3600000).toISOString()
    };
    this.handleAuthSuccess(resp);
    return of(resp);
  }

  register(request: RegisterRequestDto): Observable<CustomerDto> {
    if (!API_CONFIG.useMockData) {
      const payload = {
        firstName: request.firstName?.trim() || '',
        lastName: request.lastName?.trim() || '',
        email: request.email?.trim() || '',
        phone: request.phone?.trim() || request.phoneNumber?.trim() || null,
        password: request.password,
        confirmPassword: request.confirmPassword || request.password
      };
      return this.http.post<CustomerDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.customers.register}`, payload);
    }
    return this.mockRegister(request);
  }

  private mockRegister(request: RegisterRequestDto): Observable<CustomerDto> {
    const id = Math.floor(Math.random() * 1000) + 10;
    const customer: CustomerDto = {
      id: id,
      customerId: id,
      firstName: request.firstName || (request.fullName ? request.fullName.split(' ')[0] : 'Customer'),
      lastName: request.lastName || (request.fullName ? request.fullName.split(' ').slice(1).join(' ') : 'User'),
      email: request.email,
      phone: request.phoneNumber || request.phone || '',
      phoneNumber: request.phoneNumber || request.phone || '',
      isEmailVerified: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      bookingCount: 0,
      bookingsCount: 0
    };
    return of(customer);
  }

  verifyEmail(request: VerifyEmailRequestDto): Observable<{ message: string }> {
    if (!API_CONFIG.useMockData) {
      return this.http.post<{ message: string }>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.auth.verifyEmail}`, request);
    }
    return of({ message: 'Email verified successfully. You can now sign in.' });
  }

  resendVerification(request: ResendVerificationRequestDto): Observable<{ message: string }> {
    if (!API_CONFIG.useMockData) {
      return this.http.post<{ message: string }>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.auth.resendVerification}`, request);
    }
    return of({ message: 'If an unverified account exists for this email, a verification email has been sent.' });
  }

  forgotPassword(request: ForgotPasswordRequestDto): Observable<{ message: string }> {
    if (!API_CONFIG.useMockData) {
      return this.http.post<{ message: string }>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.auth.forgotPassword}`, request);
    }
    return of({ message: 'If an account exists for this email, a password reset link has been sent.' });
  }

  resetPassword(request: ResetPasswordRequestDto): Observable<{ message: string }> {
    if (!API_CONFIG.useMockData) {
      return this.http.post<{ message: string }>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.auth.resetPassword}`, request);
    }
    return of({ message: 'Your password has been reset successfully.' });
  }

  logout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
  }

  public setDemoCustomerSession(): void {
    const user: AuthUser = {
      id: 1,
      customerId: 1,
      email: 'leo.thas@email.com',
      displayName: 'Leo Thas',
      fullName: 'Leo Thas',
      role: 'Customer',
      token: 'demo-customer-token'
    };
    localStorage.setItem(TOKEN_KEY, user.token || '');
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public setDemoAdminSession(): void {
    const user: AuthUser = {
      id: 999,
      customerId: 0,
      email: 'alex.morgan@eventflow.com',
      displayName: 'Alex Morgan',
      fullName: 'Alex Morgan',
      role: 'Administrator',
      token: 'demo-admin-token'
    };
    localStorage.setItem(TOKEN_KEY, user.token || '');
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public switchDemoRole(role: 'Admin' | 'Customer' | string): void {
    if (role === 'Admin' || role === 'Administrator') {
      this.setDemoAdminSession();
    } else {
      this.setDemoCustomerSession();
    }
  }

  public parseTokenClaims(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as JwtPayload;
    } catch {
      return null;
    }
  }

  public isTokenExpired(token: string): boolean {
    const claims = this.parseTokenClaims(token);
    if (!claims || !claims.exp) return true;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return claims.exp <= nowInSeconds;
  }

  public getTokenExpirationDate(token: string): Date | null {
    const claims = this.parseTokenClaims(token);
    if (!claims || !claims.exp) return null;
    return new Date(claims.exp * 1000);
  }

  private handleAuthSuccess(response: LoginResponseDto): void {
    const user: AuthUser = {
      id: response.userId || (response as any).customerId || (response as any).id || 1,
      customerId: response.role === 'Customer' ? (response.userId || (response as any).customerId || (response as any).id || 1) : undefined,
      email: response.email,
      displayName: response.displayName || response.fullName || 'User',
      fullName: response.displayName || response.fullName,
      role: response.role,
      token: response.token
    };
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadStoredUser(): AuthUser | null {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        return null;
      }

      if (this.isTokenExpired(token)) {
        this.clearStorage();
        return null;
      }

      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        const user = JSON.parse(stored) as AuthUser;
        user.token = token;
        return user;
      }

      return this.createUserFromToken(token);
    } catch {
      this.clearStorage();
      return null;
    }
  }

  private createUserFromToken(token: string): AuthUser | null {
    const claims = this.parseTokenClaims(token);
    if (!claims) return null;

    const userIdStr = claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || claims['nameid'] || claims['sub'];
    const email = claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || claims['email'] || '';
    const displayName = claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || claims['name'] || 'User';
    const role = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || claims['role'] || 'Customer';
    const userId = userIdStr ? parseInt(userIdStr, 10) : 0;

    return {
      id: userId,
      customerId: role === 'Customer' ? userId : undefined,
      email,
      displayName,
      fullName: displayName,
      role,
      token
    };
  }

  private clearStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
