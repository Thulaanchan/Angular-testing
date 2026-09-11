export interface BookWithUsPass {
  bookingNumber: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  attendeeCount: number;
  seats: string[];
  parkingSlot?: string;
  qrData: string;
}

export type EventFlowPass = BookWithUsPass;
