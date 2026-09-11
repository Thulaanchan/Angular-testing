export interface BookingHold {
  bookingId: number;
  expiresAtUtc: string;
  remainingSeconds: number;
  isExpired: boolean;
}
