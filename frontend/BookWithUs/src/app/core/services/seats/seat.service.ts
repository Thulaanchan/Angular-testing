import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { SeatAvailabilityDto, SeatDto, ReserveSeatsRequest, CreateSeatRequest, UpdateSeatRequest } from '../../models/seats/seat.model';
import { MockDataService } from '../mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class SeatService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  getEventSeats(eventId: number): Observable<SeatAvailabilityDto[]> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<SeatAvailabilityDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.seats.byEvent(eventId)}`).pipe(
        catchError(() => of(this.mockData.generateSeatsForEvent(eventId)))
      );
    }
    return of(this.mockData.generateSeatsForEvent(eventId));
  }

  getSeatById(id: number): Observable<SeatDto> {
    const mockSeat: SeatDto = {
      id,
      eventId: 1,
      seatSectionId: 1,
      sectionCode: 'P',
      sectionName: 'Platinum',
      categoryCode: 'P',
      categoryName: 'Platinum',
      number: 3,
      seatNumber: 3,
      rowLabel: 'N',
      code: 'P-N-03',
      seatCode: 'P-N-03',
      adultPrice: 15000,
      childPrice: 7500,
      isAvailable: false,
      isPubliclyBookable: true,
      status: 'Booked'
    };
    if (!API_CONFIG.useMockData) {
      return this.http.get<SeatDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.seats.byId(id)}`).pipe(
        catchError(() => of(mockSeat))
      );
    }
    return of(mockSeat);
  }

  createSeat(eventId: number, request: CreateSeatRequest): Observable<SeatDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.post<SeatDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.seats.byEvent(eventId)}`, request);
    }
    const mockSeat: SeatDto = {
      id: Math.floor(Math.random() * 1000) + 100,
      eventId,
      seatSectionId: request.seatSectionId || 1,
      sectionCode: 'SEC',
      sectionName: 'Section',
      categoryCode: 'CAT',
      categoryName: 'Category',
      number: request.seatNumber || 1,
      seatNumber: request.seatNumber || 1,
      rowLabel: 'A',
      code: request.code || 'S-A-01',
      seatCode: request.code || 'S-A-01',
      adultPrice: 5000,
      childPrice: 2500,
      isAvailable: true,
      isPubliclyBookable: true,
      status: 'Available'
    };
    return of(mockSeat);
  }

  updateSeat(id: number, request: UpdateSeatRequest): Observable<SeatDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.put<SeatDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.seats.byId(id)}`, request);
    }
    const mockSeat: SeatDto = {
      id,
      eventId: 1,
      seatSectionId: request.seatSectionId || 1,
      sectionCode: 'SEC',
      sectionName: 'Updated Section',
      categoryCode: 'CAT',
      categoryName: 'Updated Category',
      number: request.seatNumber || 1,
      seatNumber: request.seatNumber || 1,
      rowLabel: 'A',
      code: request.code || 'S-A-01',
      seatCode: request.code || 'S-A-01',
      adultPrice: 5000,
      childPrice: 2500,
      isAvailable: true,
      isPubliclyBookable: true,
      status: 'Available'
    };
    return of(mockSeat);
  }

  deleteSeat(id: number): Observable<void> {
    if (!API_CONFIG.useMockData) {
      return this.http.delete<void>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.seats.byId(id)}`);
    }
    return of(void 0);
  }

  holdSeats(bookingId: number, request: ReserveSeatsRequest): Observable<any> {
    if (!API_CONFIG.useMockData) {
      return this.http.post(`${API_CONFIG.baseUrl}${API_ENDPOINTS.seats.hold(bookingId)}`, request);
    }
    return of({ success: true, message: 'Seats reserved successfully.' });
  }

  getSeatLayoutCategories(eventId: number): Observable<any[]> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<any[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.seats.layoutCategories(eventId)}`).pipe(
        catchError(() => of([
          { id: 1, eventId, name: 'VIP', code: 'VIP', adultPrice: 20000, isPubliclyBookable: false, displayOrder: 1 },
          { id: 2, eventId, name: 'Platinum', code: 'P', adultPrice: 15000, isPubliclyBookable: true, displayOrder: 2 },
          { id: 3, eventId, name: 'Gold', code: 'G', adultPrice: 12500, isPubliclyBookable: true, displayOrder: 3 },
          { id: 4, eventId, name: 'Silver', code: 'S', adultPrice: 10000, isPubliclyBookable: true, displayOrder: 4 }
        ]))
      );
    }
    return of([
      { id: 1, eventId, name: 'VIP', code: 'VIP', adultPrice: 20000, isPubliclyBookable: false, displayOrder: 1 },
      { id: 2, eventId, name: 'Platinum', code: 'P', adultPrice: 15000, isPubliclyBookable: true, displayOrder: 2 },
      { id: 3, eventId, name: 'Gold', code: 'G', adultPrice: 12500, isPubliclyBookable: true, displayOrder: 3 },
      { id: 4, eventId, name: 'Silver', code: 'S', adultPrice: 10000, isPubliclyBookable: true, displayOrder: 4 }
    ]);
  }

  getSeatLayoutSections(eventId: number): Observable<any[]> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<any[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.seats.layoutSections(eventId)}`).pipe(
        catchError(() => of([
          { id: 1, eventId, eventSeatCategoryId: 1, code: 'VIP', name: 'VIP Ring', categoryName: 'VIP', displayOrder: 1, seatCount: 20 },
          { id: 2, eventId, eventSeatCategoryId: 2, code: 'P-N', name: 'Platinum North', categoryName: 'Platinum', displayOrder: 2, seatCount: 208 },
          { id: 3, eventId, eventSeatCategoryId: 3, code: 'G-E', name: 'Gold East', categoryName: 'Gold', displayOrder: 3, seatCount: 208 },
          { id: 4, eventId, eventSeatCategoryId: 4, code: 'S-S', name: 'Silver South', categoryName: 'Silver', displayOrder: 4, seatCount: 188 }
        ]))
      );
    }
    return of([
      { id: 1, eventId, eventSeatCategoryId: 1, code: 'VIP', name: 'VIP Ring', categoryName: 'VIP', displayOrder: 1, seatCount: 20 },
      { id: 2, eventId, eventSeatCategoryId: 2, code: 'P-N', name: 'Platinum North', categoryName: 'Platinum', displayOrder: 2, seatCount: 208 },
      { id: 3, eventId, eventSeatCategoryId: 3, code: 'G-E', name: 'Gold East', categoryName: 'Gold', displayOrder: 3, seatCount: 208 },
      { id: 4, eventId, eventSeatCategoryId: 4, code: 'S-S', name: 'Silver South', categoryName: 'Silver', displayOrder: 4, seatCount: 188 }
    ]);
  }
}
