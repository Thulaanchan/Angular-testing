import { AttendeeType } from './attendee-type.model';

export interface AttendeeDetails {
  seatId: number;
  seatCode: string;
  attendeeName: string;
  attendeeType: AttendeeType;
}
