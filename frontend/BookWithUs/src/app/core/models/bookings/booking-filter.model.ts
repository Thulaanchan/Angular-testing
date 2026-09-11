import { BookingStatus } from './booking-status.model';

export interface BookingFilter {
  status?: BookingStatus | 'all';
  eventId?: number;
  search?: string;
  date?: string;
}
