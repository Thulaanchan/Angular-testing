export interface VenueAvailabilityConflictDto {
  eventId: number;
  eventName: string;
  startTime: string;
  endTime: string;
}

export interface VenueAvailabilityDto {
  venueId: number;
  venueName?: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  message?: string;
  conflicts?: VenueAvailabilityConflictDto[];
  conflictingEvents?: VenueAvailabilityConflictDto[];
}
