export interface UpdateEventRequest {
  name: string;
  description?: string;
  venueId: number;
  categoryId: number;
  eventDate: string;
  startTime: string;
  endTime: string;
  ticketPrice: number;
  capacity: number;
  stageLayout?: string;
  poster?: File;
}

export type UpdateEventDto = UpdateEventRequest;
