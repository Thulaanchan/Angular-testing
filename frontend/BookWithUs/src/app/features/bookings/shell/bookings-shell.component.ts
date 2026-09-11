import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CustomerSidebarComponent } from '../../../shared/components/customer-sidebar/customer-sidebar.component';
import { NotificationBellComponent } from '../../../shared/components/notification-bell/notification-bell.component';
import { UserMenuComponent } from '../../../shared/components/user-menu/user-menu.component';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-bookings-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    CustomerSidebarComponent,
    NotificationBellComponent,
    UserMenuComponent
  ],
  templateUrl: './bookings-shell.component.html',
  styleUrls: ['./bookings-shell.component.css']
})
export class BookingsShellComponent {
  authService = inject(AuthService);
}
