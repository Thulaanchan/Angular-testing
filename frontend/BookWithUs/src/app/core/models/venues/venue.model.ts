import { CreateVenueRequest } from './create-venue-request.model';
import { UpdateVenueRequest } from './update-venue-request.model';

export interface VenueDto {
  id: number;
  venueId?: number;
  name: string;
  address: string;
  location?: string;
  totalCapacity: number;
  capacity?: number;
  parkingCapacity?: number;
  upcomingEventCount?: number;
  upcomingEventsCount?: number;
  isActive?: boolean;
  isAvailable?: boolean;
  createdAtUtc?: string;
  city?: string;
  postalCode?: string;
}

export type Venue = VenueDto;
export type VenueDetailDto = VenueDto;
export type CreateVenueDto = CreateVenueRequest;
export type UpdateVenueDto = UpdateVenueRequest;

export * from './venue-availability.model';
export * from './create-venue-request.model';
export * from './update-venue-request.model';
