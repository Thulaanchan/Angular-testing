import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { NotificationBellComponent } from '../../../shared/components/notification-bell/notification-bell.component';
import { UserMenuComponent } from '../../../shared/components/user-menu/user-menu.component';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    AdminSidebarComponent,
    NotificationBellComponent,
    UserMenuComponent
  ],
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.css']
})
export class AdminShellComponent {
  authService = inject(AuthService);
}
