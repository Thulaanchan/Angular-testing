import { BookingStatus } from './booking-status.model';
import { AttendeeType } from './attendee-type.model';
import { VehicleType } from '../parking/vehicle-type.model';
import { SeatSelectionRequest } from '../seats/seat.model';

export interface BookingSeatDetailDto {
  seatId: number;
  seatCode: string;
  rowLabel: string;
  seatNumber: number;
  sectionName: string;
  attendeeName: string;
  attendeeType: AttendeeType | string;
  priceSnapshot: number;
  price?: number;
}

export interface BookingParkingDetailDto {
  parkingReservationId: number;
  parkingSlotId: number;
  slotCode: string;
  zoneName: string;
  vehicleType: VehicleType | string;
  feeSnapshot: number;
  fee?: number;
  reservedAtUtc: string;
}

export interface BookingEventDetailDto {
  eventId: number;
  eventName: string;
  description?: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venueName: string;
  categoryName: string;
  posterUrl?: string;
}

export interface BookingDto {
  bookingId: number;
  bookingNumber: string;
  bookingReference?: string;
  customerId: number;
  customerName?: string;
  eventId: number;
  bookingStatus: BookingStatus;
  status?: string;
  holdExpiresAtUtc: string;
  createdAt: string;
  bookingDate?: string;
  updatedAt?: string;
  event?: BookingEventDetailDto;
  eventTitle?: string;
  eventDate?: string;
  startTime?: string;
  venueName?: string;
  venueLocation?: string;
  seatSummary?: string;
  seats: BookingSeatDetailDto[];
  parking?: BookingParkingDetailDto;
  totalAmount: number;
}

export interface BookingSummaryDto {
  bookingId: number;
  bookingNumber: string;
  bookingReference?: string;
  customerId: number;
  customerName?: string;
  eventId: number;
  bookingStatus: BookingStatus;
  status?: string;
  eventName: string;
  eventTitle?: string;
  eventDate?: string;
  startTime?: string;
  venueName: string;
  posterUrl?: string;
  seatCount: number;
  seatSummary?: string;
  hasParking: boolean;
  parkingSlotCode?: string;
  totalAmount: number;
  holdExpiresAtUtc: string;
  createdAt: string;
  bookingDate?: string;
}

export interface CancelBookingResponseDto {
  bookingId: number;
  bookingNumber: string;
  bookingStatus: BookingStatus;
  message: string;
}

export interface CreateBookingRequestDto {
  eventId: number;
  seats: SeatSelectionRequest[];
  parkingSlotId?: number;
}

export type Booking = BookingDto;
