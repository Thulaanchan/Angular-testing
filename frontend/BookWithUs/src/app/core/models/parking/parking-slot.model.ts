import { ParkingStatus } from './parking-status.model';
import { VehicleType } from './vehicle-type.model';

export interface ParkingAvailabilityDto {
  id: number;
  slotId?: number;
  slotCode: string;
  status: string | ParkingStatus;
  zoneId?: number;
  zoneName: string;
  zoneCode?: string;
  vehicleType: string | VehicleType;
  fee: number;
  price?: number;
  isOnlineBookable?: boolean;
  isAvailableForBooking?: boolean;
  positionX?: number;
  positionY?: number;
}

export interface ParkingSlotDto {
  id: number;
  slotId?: number;
  eventId: number;
  parkingZoneId: number;
  slotCode: string;
  status: string;
  isOccupied?: boolean;
  zoneName: string;
  vehicleType: string;
  fee: number;
  isOnlineBookable: boolean;
  displayOrder: number;
  positionX?: number;
  positionY?: number;
}

export interface ParkingZoneDto {
  id: number;
  eventId: number;
  name: string;
  vehicleType: string;
  fee: number;
  isOnlineBookable: boolean;
  displayOrder: number;
  slotCount: number;
}

export interface ReserveParkingRequest {
  parkingSlotId: number;
}

export interface CreateParkingSlotRequest {
  parkingZoneId: number;
  slotCode: string;
  displayOrder: number;
  positionX?: number;
  positionY?: number;
}

export interface UpdateParkingSlotRequestDto {
  parkingZoneId: number;
  slotCode: string;
  displayOrder: number;
  positionX?: number;
  positionY?: number;
}

export interface CreateParkingZoneRequest {
  name: string;
  vehicleType: VehicleType;
  fee: number;
  isOnlineBookable: boolean;
  displayOrder: number;
}

export interface UpdateParkingZoneRequest {
  name: string;
  vehicleType: VehicleType;
  fee: number;
  isOnlineBookable: boolean;
  displayOrder: number;
}

export type ParkingSlot = ParkingAvailabilityDto;
export type ParkingZone = ParkingZoneDto;
