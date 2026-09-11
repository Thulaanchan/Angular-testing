import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { NotificationDto } from '../../models/notifications/notification.model';
import { MockDataService } from '../mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  private unreadCountSubject = new BehaviorSubject<number>(3);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  getCustomerNotifications(customerId: number): Observable<NotificationDto[]> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<NotificationDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.notifications.byCustomer(customerId)}`).pipe(
        tap(items => {
          const unread = items.filter(n => !n.isRead).length;
          this.unreadCountSubject.next(unread);
        }),
        catchError(() => of(this.mockData.notifications))
      );
    }
    const unread = this.mockData.notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unread);
    return of(this.mockData.notifications);
  }

  getNotifications(customerId: number = 1): Observable<NotificationDto[]> {
    return this.getCustomerNotifications(customerId);
  }

  getUnreadCount(customerId: number): Observable<number> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<number>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.notifications.unreadCount(customerId)}`).pipe(
        tap(count => this.unreadCountSubject.next(count)),
        catchError(() => of(this.mockData.notifications.filter(n => !n.isRead).length))
      );
    }
    const count = this.mockData.notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(count);
    return of(count);
  }

  markAsRead(id: number): Observable<void> {
    if (!API_CONFIG.useMockData) {
      return this.http.put<void>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.notifications.markRead(id)}`, {}).pipe(
        catchError(() => {
          const notif = this.mockData.notifications.find(n => n.notificationId === id);
          if (notif) notif.isRead = true;
          this.unreadCountSubject.next(this.mockData.notifications.filter(n => !n.isRead).length);
          return of(void 0);
        })
      );
    }
    const notif = this.mockData.notifications.find(n => n.notificationId === id);
    if (notif) notif.isRead = true;
    this.unreadCountSubject.next(this.mockData.notifications.filter(n => !n.isRead).length);
    return of(void 0);
  }

  markAllAsRead(): Observable<void> {
    this.mockData.notifications.forEach(n => n.isRead = true);
    this.unreadCountSubject.next(0);
    return of(void 0);
  }
}
