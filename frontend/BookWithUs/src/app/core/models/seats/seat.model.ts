import { SeatStatus } from './seat-status.model';
import { AttendeeType } from '../bookings/attendee-type.model';

export interface SeatAvailabilityDto {
  id: number;
  seatId?: number;
  seatCode: string;
  rowLabel: string;
  number: number;
  seatNumber?: number;
  sectionId: number;
  sectionCode: string;
  sectionName: string;
  categoryCode: string;
  categoryName: string;
  adultPrice: number;
  childPrice: number;
  price?: number;
  tierName?: string;
  isPubliclyBookable: boolean;
  status: string | SeatStatus;
  isVip?: boolean;
  positionX?: number;
  positionY?: number;
}

export interface SeatDto {
  id: number;
  eventId: number;
  seatSectionId: number;
  seatCode: string;
  code?: string;
  rowLabel: string;
  number: number;
  seatNumber?: number;
  sectionCode: string;
  sectionName: string;
  categoryCode: string;
  categoryName: string;
  adultPrice: number;
  childPrice?: number;
  isPubliclyBookable?: boolean;
  isAvailable?: boolean;
  status: string;
  displayOrder?: number;
  positionX?: number;
  positionY?: number;
}

export interface EventSeatCategoryDto {
  id: number;
  eventId: number;
  name: string;
  code: string;
  adultPrice: number;
  childPrice: number;
  isPubliclyBookable: boolean;
  displayOrder: number;
}

export interface SeatSectionDto {
  id: number;
  eventId: number;
  eventSeatCategoryId: number;
  code: string;
  name: string;
  categoryName: string;
  displayOrder: number;
  seatCount: number;
}

export interface SeatSelectionRequest {
  seatId: number;
  attendeeType: AttendeeType;
  attendeeName: string;
}

export interface ReserveSeatsRequest {
  seats: SeatSelectionRequest[];
}

export type CreateSeatRequest = any;
export type UpdateSeatRequest = any;
export type Seat = SeatAvailabilityDto;
