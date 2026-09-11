import { ParkingAvailabilityDto } from './parking-slot.model';

export interface SelectedParking {
  slot: ParkingAvailabilityDto;
  fee: number;
}
