import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { NotificationDto, NotificationType } from '../../models/notifications/notification.model';
import { MockDataService } from '../mock-data.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);
  private authService = inject(AuthService);

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  getCustomerNotifications(customerId?: number): Observable<NotificationDto[]> {
    const targetId = customerId || this.authService.getCustomerId();
    if (!targetId) {
      this.unreadCountSubject.next(0);
      return of([]);
    }

    if (!API_CONFIG.useMockData) {
      return this.http.get<NotificationDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.notifications.byCustomer(targetId)}`).pipe(
        map(items => this.enrichAndSortNotifications(items || [])),
        tap(items => {
          const unread = items.filter(n => !n.isRead).length;
          this.unreadCountSubject.next(unread);
        })
      );
    }
    const unread = this.mockData.notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unread);
    return of(this.enrichAndSortNotifications(this.mockData.notifications));
  }

  getNotifications(customerId?: number): Observable<NotificationDto[]> {
    return this.getCustomerNotifications(customerId);
  }

  getUnreadCount(customerId?: number): Observable<number> {
    const targetId = customerId || this.authService.getCustomerId();
    if (!targetId) {
      this.unreadCountSubject.next(0);
      return of(0);
    }

    if (!API_CONFIG.useMockData) {
      return this.http.get<number>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.notifications.unreadCount(targetId)}`).pipe(
        tap(count => this.unreadCountSubject.next(count || 0))
      );
    }
    const count = this.mockData.notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(count);
    return of(count);
  }

  refreshUnreadCount(): void {
    if (this.authService.isAuthenticated() && this.authService.isCustomer()) {
      this.getUnreadCount().subscribe({
        error: () => {}
      });
    } else {
      this.unreadCountSubject.next(0);
    }
  }

  markAsRead(id: number): Observable<void> {
    if (!API_CONFIG.useMockData) {
      return this.http.put<void>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.notifications.markRead(id)}`, {}).pipe(
        tap(() => {
          const cur = this.unreadCountSubject.value;
          if (cur > 0) this.unreadCountSubject.next(cur - 1);
        })
      );
    }
    const notif = this.mockData.notifications.find(n => n.notificationId === id);
    if (notif) notif.isRead = true;
    this.unreadCountSubject.next(this.mockData.notifications.filter(n => !n.isRead).length);
    return of(void 0);
  }

  markAllAsRead(unreadNotifications?: NotificationDto[]): Observable<any> {
    if (!API_CONFIG.useMockData) {
      // Backend does not provide a bulk /read-all endpoint. Safely execute per-notification read on unread items.
      if (unreadNotifications && unreadNotifications.length > 0) {
        const unread = unreadNotifications.filter(n => !n.isRead);
        if (unread.length === 0) {
          this.unreadCountSubject.next(0);
          return of([]);
        }
        const calls = unread.map(n => this.http.put<void>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.notifications.markRead(n.notificationId)}`, {}));
        return forkJoin(calls).pipe(
          tap(() => {
            this.unreadCountSubject.next(0);
          })
        );
      }

      const customerId = this.authService.getCustomerId();
      if (!customerId) {
        this.unreadCountSubject.next(0);
        return of([]);
      }

      return this.getCustomerNotifications(customerId).pipe(
        concatMap(items => {
          const unread = items.filter(n => !n.isRead);
          if (unread.length === 0) {
            this.unreadCountSubject.next(0);
            return of([]);
          }
          const calls = unread.map(n => this.http.put<void>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.notifications.markRead(n.notificationId)}`, {}));
          return forkJoin(calls);
        }),
        tap(() => {
          this.unreadCountSubject.next(0);
        })
      );
    }

    this.mockData.notifications.forEach(n => n.isRead = true);
    this.unreadCountSubject.next(0);
    return of(void 0);
  }

  private enrichAndSortNotifications(items: NotificationDto[]): NotificationDto[] {
    const enriched = items.map(n => {
      const titleLower = (n.title || '').toLowerCase();
      const msgLower = (n.message || '').toLowerCase();

      let type: NotificationType = 'event';
      if (titleLower.includes('payment') || msgLower.includes('payment') || msgLower.includes('paid')) {
        type = 'payment';
      } else if (titleLower.includes('parking') || msgLower.includes('parking') || msgLower.includes('slot')) {
        type = 'parking';
      } else if (titleLower.includes('booking') || msgLower.includes('booking') || msgLower.includes('reserve') || titleLower.includes('ticket')) {
        type = 'booking';
      }

      const bookingMatch = (n.message || '').match(/BKG-\d{4}-\d+/i) || (n.title || '').match(/BKG-\d{4}-\d+/i);
      const bookingNumber = bookingMatch ? bookingMatch[0].toUpperCase() : undefined;

      let actionUrl: string | undefined;
      if (bookingNumber) {
        actionUrl = `/customer/bookings`;
      } else if (type === 'payment') {
        actionUrl = `/customer/payments`;
      } else if (type === 'booking') {
        actionUrl = `/customer/bookings`;
      } else if (type === 'event') {
        actionUrl = `/events`;
      }

      return {
        ...n,
        createdAt: n.createdAtUtc || n.createdAt,
        type: n.type || type,
        bookingNumber: n.bookingNumber || bookingNumber,
        actionUrl: n.actionUrl || actionUrl
      };
    });

    return enriched.sort((a, b) => {
      const timeA = new Date(a.createdAtUtc || a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAtUtc || b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  }
}
