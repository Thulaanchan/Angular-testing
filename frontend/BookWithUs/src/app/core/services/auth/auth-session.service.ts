import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {
  private authService = inject(AuthService);

  public get user$() {
    return this.authService.currentUser$;
  }

  public get currentUser() {
    return this.authService.currentUserValue;
  }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  public get token(): string | null {
    return this.authService.getToken();
  }

  public get customerId(): number | null {
    return this.authService.getCustomerId();
  }

  public get role(): string | null {
    return this.authService.currentUserValue?.role ? String(this.authService.currentUserValue.role) : null;
  }

  public get claims() {
    const token = this.authService.getToken();
    return token ? this.authService.parseTokenClaims(token) : null;
  }

  public logout(): void {
    this.authService.logout();
  }
}
