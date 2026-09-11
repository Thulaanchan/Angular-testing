import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { NotificationService } from '../../../core/services/notifications/notification.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationDto } from '../../../core/models/notifications/notification.model';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  private router = inject(Router);

  isOpen = false;
  unreadCount$ = this.notificationService.unreadCount$;
  recentNotifications: NotificationDto[] = [];
  isLoadingRecent = false;
  private navSub?: Subscription;

  ngOnInit(): void {
    this.notificationService.refreshUnreadCount();

    this.navSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.authService.isAuthenticated()) {
          this.notificationService.refreshUnreadCount();
        }
      });
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.authService.isAuthenticated()) {
      this.loadRecentNotifications();
    }
  }

  close(): void {
    this.isOpen = false;
  }

  loadRecentNotifications(): void {
    this.isLoadingRecent = true;
    this.notificationService.getCustomerNotifications().subscribe({
      next: (items) => {
        this.recentNotifications = (items || []).slice(0, 5);
        this.isLoadingRecent = false;
      },
      error: () => {
        this.recentNotifications = [];
        this.isLoadingRecent = false;
      }
    });
  }

  markAllRead(): void {
    const unread = this.recentNotifications.filter(n => !n.isRead);
    this.notificationService.markAllAsRead(unread).subscribe({
      next: () => {
        this.recentNotifications.forEach(n => n.isRead = true);
      }
    });
  }

  openNotification(item: NotificationDto): void {
    if (!item.isRead) {
      this.notificationService.markAsRead(item.notificationId).subscribe({
        next: () => {
          item.isRead = true;
        }
      });
    }
    this.close();
    if (item.actionUrl) {
      this.router.navigateByUrl(item.actionUrl);
    } else {
      this.router.navigate(['/customer/notifications']);
    }
  }
}
