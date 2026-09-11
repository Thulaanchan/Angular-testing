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
}
