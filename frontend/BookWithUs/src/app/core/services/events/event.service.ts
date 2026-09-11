import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { EventDetailsDto, EventListItemDto, EventQueryDto } from '../../models/events/event.model';
import { PagedResult } from '../../models/common/paged-result.model';
import { MockDataService } from '../mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  getEvents(query?: EventQueryDto): Observable<PagedResult<EventListItemDto>> {
    if (!API_CONFIG.useMockData) {
      let params = new HttpParams();
      const searchVal = query?.searchTerm || (query as any)?.search;
      if (searchVal) params = params.set('search', searchVal);

      const venueVal = query?.venueId || (query as any)?.venue;
      if (venueVal) params = params.set('venue', venueVal.toString());

      const catVal = query?.categoryId || (query as any)?.category;
      if (catVal) params = params.set('category', catVal.toString());

      const dateVal = query?.startDate || (query as any)?.date;
      if (dateVal) params = params.set('date', dateVal);

      if ((query as any)?.time) params = params.set('time', (query as any).time);
      if (query?.page) params = params.set('page', query.page.toString());
      if (query?.pageSize) params = params.set('pageSize', query.pageSize.toString());
      if (query?.includePast) params = params.set('includePast', 'true');

      return this.http.get<PagedResult<EventListItemDto>>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.events.base}`, { params }).pipe(
        map(res => ({
          ...res,
          pageNumber: res.page ?? (res as any).pageNumber ?? 1,
          total: res.totalCount ?? (res as any).total ?? 0
        }))
      );
    }
    return of(this.getMockEvents(query));
  }

  getEventById(id: number): Observable<EventDetailsDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<EventDetailsDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.events.byId(id)}`);
    }
    const event = this.mockData.events.find(e => e.id === id) || this.mockData.events[0];
    return of(event);
  }

  createEvent(data: FormData | any): Observable<EventDetailsDto> {
    if (!API_CONFIG.useMockData) {
      const body = data instanceof FormData ? data : this.toFormData(data);
      return this.http.post<EventDetailsDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.events.base}`, body);
    }
    return of(this.createMockEvent(data));
  }

  updateEvent(id: number, data: FormData | any): Observable<EventDetailsDto> {
    if (!API_CONFIG.useMockData) {
      const body = data instanceof FormData ? data : this.toFormData(data);
      return this.http.put<EventDetailsDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.events.byId(id)}`, body);
    }
    return of(this.mockData.events.find(e => e.id === id) || this.mockData.events[0]);
  }

  deleteEvent(id: number): Observable<void> {
    if (!API_CONFIG.useMockData) {
      return this.http.delete<void>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.events.byId(id)}`);
    }
    this.mockData.events = this.mockData.events.filter(e => e.id !== id);
    return of(void 0);
  }

  private toFormData(obj: any): FormData {
    const fd = new FormData();
    for (const key of Object.keys(obj)) {
      if (obj[key] !== null && obj[key] !== undefined) {
        const formKey = key.charAt(0).toUpperCase() + key.slice(1);
        fd.append(formKey, obj[key]);
      }
    }
    return fd;
  }

  private getMockEvents(query?: EventQueryDto): PagedResult<EventListItemDto> {
    let items: EventListItemDto[] = this.mockData.events.map(e => ({
      id: e.id,
      eventId: e.id,
      name: e.name,
      title: e.name,
      venueId: e.venueId,
      venueName: e.venueName,
      venueAddress: e.venueAddress,
      venueLocation: e.venueAddress,
      categoryId: e.categoryId,
      categoryName: e.categoryName,
      eventDate: e.eventDate,
      startTime: e.startTime,
      endTime: e.endTime,
      ticketPrice: e.ticketPrice || e.baseTicketPrice || 5000,
      baseTicketPrice: e.baseTicketPrice || e.ticketPrice || 5000,
      childDiscountPercent: e.childDiscountPercent || 50,
      totalCapacity: e.totalCapacity || e.capacity || e.totalSeats || 624,
      totalSeats: e.totalSeats || e.totalCapacity || 624,
      bookedSeats: e.bookedSeats || e.bookedSeatsCount || 0,
      bookedSeatsCount: e.bookedSeatsCount || e.bookedSeats || 0,
      availableSeats: e.availableSeats || e.availableSeatsCount || 624,
      availableSeatsCount: e.availableSeatsCount || e.availableSeats || 624,
      soldPercentage: e.soldPercentage || 0,
      hasBookings: e.hasBookings || false,
      canDelete: e.canDelete !== false,
      posterUrl: e.posterUrl || e.posterImageUrl,
      posterImageUrl: e.posterImageUrl || e.posterUrl,
      status: e.status || 'Active'
    }));

    if (query?.searchTerm) {
      const term = query.searchTerm.toLowerCase();
      items = items.filter(e => e.name.toLowerCase().includes(term) || e.venueName.toLowerCase().includes(term));
    }
    if (query?.venueId) {
      const venue = this.mockData.venues.find(v => (v.id ?? v.venueId) === query.venueId);
      if (venue) {
        items = items.filter(e => e.venueName.toLowerCase().includes(venue.name.toLowerCase()));
      }
    }
    if (query?.categoryId) {
      const cat = this.mockData.categories.find(c => c.id === query.categoryId);
      if (cat) {
        items = items.filter(e => e.categoryName.toLowerCase().includes(cat.name.toLowerCase()));
      }
    }

    const page = query?.page || query?.pageNumber || 1;
    const pageSize = query?.pageSize || 10;
    const totalCount = items.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const pagedItems = items.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: pagedItems,
      page,
      pageNumber: page,
      pageSize,
      totalCount,
      total: totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };
  }

  private createMockEvent(formData: FormData): EventDetailsDto {
    const name = (formData.get('Name') as string) || 'New Event';
    const venueId = Number(formData.get('VenueId')) || 1;
    const categoryId = Number(formData.get('CategoryId')) || 1;
    const venue = this.mockData.venues.find(v => (v.id ?? v.venueId) === venueId);
    const category = this.mockData.categories.find(c => c.id === categoryId);

    const newEvent: EventDetailsDto = {
      id: this.mockData.events.length + 1,
      eventId: this.mockData.events.length + 1,
      name: name,
      title: name,
      description: (formData.get('Description') as string) || '',
      venueId: venueId,
      venueName: venue?.name || 'Unicom TIC',
      venueAddress: venue?.address || 'Jaffna, Sri Lanka',
      venueLocation: venue?.address || 'Jaffna, Sri Lanka',
      venueCapacity: Number(formData.get('Capacity')) || 624,
      categoryId: categoryId,
      categoryName: category?.name || 'Music Concert',
      eventDate: (formData.get('EventDate') as string) || '2026-09-12',
      startTime: (formData.get('StartTime') as string) || '12:00:00',
      endTime: (formData.get('EndTime') as string) || '16:00:00',
      ticketPrice: Number(formData.get('TicketPrice')) || 5000,
      baseTicketPrice: Number(formData.get('TicketPrice')) || 5000,
      childDiscountPercent: 50,
      totalCapacity: Number(formData.get('Capacity')) || 624,
      capacity: Number(formData.get('Capacity')) || 624,
      totalSeats: Number(formData.get('Capacity')) || 624,
      bookedSeats: 0,
      bookedSeatsCount: 0,
      availableSeats: Number(formData.get('Capacity')) || 624,
      availableSeatsCount: Number(formData.get('Capacity')) || 624,
      bookingCount: 0,
      soldPercentage: 0,
      hasBookings: false,
      canEditTicketPrice: true,
      canEditCapacity: true,
      canEditStageLayout: true,
      canDelete: true,
      posterUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200',
      status: 'Upcoming'
    };

    this.mockData.events.unshift(newEvent);
    return newEvent;
  }
}
