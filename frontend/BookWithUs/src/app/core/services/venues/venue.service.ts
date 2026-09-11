import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { CreateVenueDto, UpdateVenueDto, VenueAvailabilityDto, VenueDto } from '../../models/venues/venue.model';
import { MockDataService } from '../mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  getVenues(): Observable<VenueDto[]> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<VenueDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.venues.base}`);
    }
    return of(this.mockData.venues);
  }

  getVenueById(id: number): Observable<VenueDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<VenueDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.venues.byId(id)}`);
    }
    return of(this.mockData.venues.find(v => v.id === id) || this.mockData.venues[0]);
  }

  checkAvailability(id: number, date: string, start: string, end: string, excludeEventId?: number): Observable<VenueAvailabilityDto> {
    if (!API_CONFIG.useMockData) {
      let params = new HttpParams()
        .set('date', date)
        .set('start', start)
        .set('end', end);
      if (excludeEventId) params = params.set('excludeEventId', excludeEventId.toString());

      return this.http.get<VenueAvailabilityDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.venues.availability(id)}`, { params });
    }
    return of(this.mockAvailability(id, date, start, end));
  }

  createVenue(request: CreateVenueDto): Observable<VenueDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.post<VenueDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.venues.base}`, request);
    }
    return of(this.createMockVenue(request));
  }

  updateVenue(id: number, request: UpdateVenueDto): Observable<VenueDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.put<VenueDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.venues.byId(id)}`, request);
    }
    return of(this.updateMockVenue(id, request));
  }

  deleteVenue(id: number): Observable<void> {
    if (!API_CONFIG.useMockData) {
      return this.http.delete<void>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.venues.byId(id)}`);
    }
    this.mockData.venues = this.mockData.venues.filter(v => v.id !== id);
    return of(void 0);
  }

  private mockAvailability(id: number, date: string, start: string, end: string): VenueAvailabilityDto {
    const venue = this.mockData.venues.find(v => v.id === id) || this.mockData.venues[0];
    return {
      venueId: venue.id,
      venueName: venue.name,
      date,
      startTime: start,
      endTime: end,
      isAvailable: true,
      conflictingEvents: []
    };
  }

  private createMockVenue(request: CreateVenueDto): VenueDto {
    const newVenue: VenueDto = {
      id: this.mockData.venues.length + 1,
      name: request.name,
      address: request.address,
      totalCapacity: request.totalCapacity,
      upcomingEventsCount: 0,
      isAvailable: true,
      createdAtUtc: new Date().toISOString()
    };
    this.mockData.venues.push(newVenue);
    return newVenue;
  }

  private updateMockVenue(id: number, request: UpdateVenueDto): VenueDto {
    const venue = this.mockData.venues.find(v => v.id === id);
    if (venue) {
      venue.name = request.name;
      venue.address = request.address;
      venue.totalCapacity = request.totalCapacity;
      return venue;
    }
    return this.mockData.venues[0];
  }
}
