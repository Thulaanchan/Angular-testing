export interface ConflictResponse {
  status?: number;
  code?: string;
  message: string;
  conflictingResourceIds?: number[];
  conflictingSeatIds?: number[];
  conflictingParkingSlotId?: number;
}
