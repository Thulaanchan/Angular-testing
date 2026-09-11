import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  logout() {
    this.authService.logout();
    this.close();
    this.router.navigate(['/auth/login']);
  }

  switchToAdmin() {
    this.authService.setDemoAdminSession();
    this.close();
    this.router.navigate(['/admin/dashboard']);
  }

  switchToCustomer() {
    this.authService.setDemoCustomerSession();
    this.close();
    this.router.navigate(['/customer/dashboard']);
  }

  get userInitials(): string {
    const user = this.authService.currentUserValue;
    if (!user) return 'BW';
    const name = user.fullName || user.displayName || 'User';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
