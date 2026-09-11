import { Pipe, PipeTransform } from '@angular/core';
import { BookingStatus } from '../../core/models/bookings/booking-status.model';

@Pipe({
  name: 'bookingStatus',
  standalone: true
})
export class BookingStatusPipe implements PipeTransform {
  transform(value: BookingStatus | string | number | undefined): string {
    if (value === undefined || value === null) return '';
    if (typeof value === 'string') return value;

    switch (value) {
      case BookingStatus.Pending:
        return 'Pending';
      case BookingStatus.Confirmed:
        return 'Confirmed';
      case BookingStatus.Cancelled:
        return 'Cancelled';
      case BookingStatus.Expired:
        return 'Expired';
      default:
        return 'Unknown';
    }
  }
}
