import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notifications/notification.service';
import { NotificationDto, NotificationType } from '../../../../core/models/notifications/notification.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.css']
})
export class NotificationsPageComponent implements OnInit {
  private notificationService = inject(NotificationService);

  notifications: NotificationDto[] = [];
  filteredNotifications: NotificationDto[] = [];
  isLoading = true;
  selectedFilter: 'all' | 'unread' = 'all';

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.notificationService.getNotifications().subscribe({
      next: (data: NotificationDto[]) => {
        this.notifications = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
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

  markAsRead(item: NotificationDto): void {
    if (item.isRead) return;
    this.notificationService.markAsRead(item.notificationId).subscribe({
      next: () => {
        item.isRead = true;
        this.applyFilter();
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this.applyFilter();
      }
    });
  }
}
