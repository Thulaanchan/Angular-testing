import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notifications/notification.service';
import { NotificationDto } from '../../../../core/models/notifications/notification.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { AlertBannerComponent } from '../../../../shared/components/alert-banner/alert-banner.component';
import { ShortTextPipe } from '../../../../shared/pipes/short-text.pipe';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    AlertBannerComponent,
    ShortTextPipe
  ],
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.css']
})
export class NotificationsPageComponent implements OnInit {
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  notifications: NotificationDto[] = [];
  filteredNotifications: NotificationDto[] = [];
  isLoading = true;
  errorMessage = '';
  selectedFilter: 'all' | 'unread' = 'all';

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  get todayNotifications(): NotificationDto[] {
    return this.filteredNotifications.filter(n => this.isToday(n.createdAtUtc || n.createdAt || ''));
  }

  get earlierNotifications(): NotificationDto[] {
    return this.filteredNotifications.filter(n => !this.isToday(n.createdAtUtc || n.createdAt || ''));
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.notificationService.getNotifications().subscribe({
      next: (data: NotificationDto[]) => {
        this.notifications = data || [];
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.notifications = [];
        this.filteredNotifications = [];
        this.errorMessage = 'Unable to load notifications. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  setFilter(filter: 'all' | 'unread'): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.selectedFilter === 'unread') {
      this.filteredNotifications = this.notifications.filter(n => !n.isRead);
    } else {
      this.filteredNotifications = [...this.notifications];
    }
  }

  isToday(dateStr: string): boolean {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
  }

  markAsRead(item: NotificationDto, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (item.isRead) return;
    this.notificationService.markAsRead(item.notificationId).subscribe({
      next: () => {
        item.isRead = true;
        this.applyFilter();
      },
      error: () => {}
    });
  }

  markAllAsRead(): void {
    const unread = this.notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;
    this.notificationService.markAllAsRead(unread).subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this.applyFilter();
      },
      error: () => {}
    });
  }

  navigateTo(item: NotificationDto, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (!item.isRead) {
      this.markAsRead(item);
    }
    if (item.actionUrl) {
      this.router.navigateByUrl(item.actionUrl);
    }
  }
}
