export interface EventListItemDto {
  id: number;
  eventId?: number;
  name: string;
  title?: string;
  posterUrl?: string;
  posterImageUrl?: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  ticketPrice?: number;
  baseTicketPrice?: number;
  childDiscountPercent?: number;
  venueId?: number;
  venueName: string;
  venueAddress?: string;
  venueLocation?: string;
  venueCity?: string;
  categoryId?: number;
  categoryName: string;
  capacity?: number;
  totalCapacity?: number;
  totalSeats?: number;
  availableSeats?: number;
  availableSeatsCount?: number;
  bookedSeats?: number;
  bookedSeatsCount?: number;
  soldPercentage?: number;
  hasBookings?: boolean;
  canDelete?: boolean;
  status?: string;
}

export interface EventDetailsDto {
  id: number;
  eventId?: number;
  name: string;
  title?: string;
  description?: string;
  posterUrl?: string;
  posterImageUrl?: string;
  stageLayout?: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  ticketPrice?: number;
  baseTicketPrice?: number;
  childDiscountPercent?: number;
  venueId: number;
  venueName: string;
  venueAddress: string;
  venueLocation?: string;
  venueCity?: string;
  venueCapacity?: number;
  categoryId: number;
  categoryName: string;
  capacity?: number;
  totalCapacity?: number;
  totalSeats?: number;
  availableSeats?: number;
  availableSeatsCount?: number;
  bookedSeats?: number;
  bookedSeatsCount?: number;
  bookingCount?: number;
  soldPercentage?: number;
  hasBookings?: boolean;
  canEditTicketPrice?: boolean;
  canEditCapacity?: boolean;
  canEditStageLayout?: boolean;
  canDelete?: boolean;
  heldSeatsCount?: number;
  status?: string;
}

export interface EventSummaryDto extends EventListItemDto {
  status?: string;
}

export interface EventQueryParametersDto {
  pageNumber?: number;
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  categoryId?: number;
  venueId?: number;
  startDate?: string;
  endDate?: string;
  includePast?: boolean;
  sortBy?: string;
}

export type Event = EventListItemDto;
export type EventDetails = EventDetailsDto;
export type EventQueryDto = EventQueryParametersDto;
