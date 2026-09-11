import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { ParkingAvailabilityDto, ParkingSlotDto, CreateParkingSlotRequest, UpdateParkingSlotRequestDto } from '../../models/parking/parking-slot.model';
import { MockDataService } from '../mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  getEventParkingSlots(eventId: number): Observable<ParkingAvailabilityDto[]> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<ParkingAvailabilityDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.parking.byEvent(eventId)}`).pipe(
        catchError(() => of(this.mockData.generateParkingSlotsForEvent(eventId)))
      );
    }
    return of(this.mockData.generateParkingSlotsForEvent(eventId));
  }

  getVenueParkingSlots(venueId: number): Observable<ParkingAvailabilityDto[]> {
    return this.getEventParkingSlots(venueId);
  }

  getParkingSlotById(id: number): Observable<ParkingSlotDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<ParkingSlotDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.parking.byId(id)}`).pipe(
        catchError(() => of(this.getMockSlot(id)))
      );
    }
    return of(this.getMockSlot(id));
  }

  reserveParking(bookingId: number, request: { parkingSlotId: number }): Observable<any> {
    if (!API_CONFIG.useMockData) {
      return this.http.post(`${API_CONFIG.baseUrl}${API_ENDPOINTS.parking.reserve(bookingId)}`, request);
    }
    return of({ success: true, message: 'Parking slot reserved.' });
  }

  removeParking(bookingId: number): Observable<any> {
    if (!API_CONFIG.useMockData) {
      return this.http.delete(`${API_CONFIG.baseUrl}${API_ENDPOINTS.parking.remove(bookingId)}`);
    }
    return of(void 0);
  }

  getEventParkingZones(eventId: number): Observable<any[]> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<any[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.parking.zones(eventId)}`).pipe(
        catchError(() => of(this.getMockZones()))
      );
    }
    return of(this.getMockZones());
  }

  updateParkingFee(eventId: number, newFee: number): Observable<any> {
    return of({ success: true, newFee });
  }

  private getMockSlot(id: number): ParkingSlotDto {
    return {
      id,
      slotId: id,
      eventId: 1,
      parkingZoneId: 1,
      zoneName: 'Car Zone',
      vehicleType: 'Car',
      fee: 500,
      isOnlineBookable: true,
      displayOrder: id,
      slotCode: 'C13',
      status: 'Available',
      isOccupied: false
    };
  }

  private getMockZones(): any[] {
    return [
      { id: 1, name: 'Three-Wheeler Zone', code: 'TW', vehicleType: 'ThreeWheeler', slotCount: 12, fee: 300 },
      { id: 2, name: 'Car Zone', code: 'CAR', vehicleType: 'Car', slotCount: 40, fee: 500 },
      { id: 3, name: 'Van Zone', code: 'VAN', vehicleType: 'Van', slotCount: 8, fee: 500 },
      { id: 4, name: 'Motorbike Zone', code: 'MB', vehicleType: 'Motorbike', slotCount: 6, fee: 0, isOnline: false }
    ];
  }
}
