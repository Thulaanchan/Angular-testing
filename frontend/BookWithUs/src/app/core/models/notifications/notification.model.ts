export type NotificationType = 'booking' | 'payment' | 'parking' | 'event' | string;

export interface NotificationDto {
  notificationId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAtUtc: string;
  createdAt?: string;
  type?: NotificationType;
  actionUrl?: string;
  bookingNumber?: string;
}

export type Notification = NotificationDto;
