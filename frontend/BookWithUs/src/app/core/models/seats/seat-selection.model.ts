import { SeatAvailabilityDto } from './seat.model';
import { AttendeeType } from '../bookings/attendee-type.model';

export interface SelectedSeatItem {
  seat: SeatAvailabilityDto;
  attendeeType: AttendeeType;
  attendeeName: string;
  price: number;
}
