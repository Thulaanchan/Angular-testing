import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { BookingDto, BookingSummaryDto, CancelBookingResponseDto, CreateBookingRequestDto } from '../../models/bookings/booking.model';
import { MockDataService } from '../mock-data.service';
import { BookingStatus } from '../../models/bookings/booking-status.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);
  private authService = inject(AuthService);

  createBooking(request: CreateBookingRequestDto): Observable<BookingDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.post<BookingDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.bookings.base}`, request);
    }
    return of(this.createMockBooking(request));
  }

  getBookingById(id: number): Observable<BookingDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<BookingDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.bookings.byId(id)}`);
    }
    const booking = this.mockData.bookings.find(b => b.bookingId === id) || this.mockData.bookings[0];
    return of(booking);
  }

  getCustomerBookings(customerId?: number): Observable<BookingSummaryDto[]> {
    const targetId = customerId || this.authService.getCustomerId() || 1;
    if (!API_CONFIG.useMockData) {
      return this.http.get<BookingSummaryDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.bookings.byCustomer(targetId)}`);
    }
    return of(this.getMockSummaries(targetId));
  }

  getEventBookings(eventId: number): Observable<BookingSummaryDto[]> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<BookingSummaryDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.bookings.byEvent(eventId)}`);
    }
    return of(this.getMockEventBookings(eventId));
  }

  getAllBookings(): Observable<BookingSummaryDto[]> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<BookingSummaryDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.bookings.base}`);
    }
    return of(this.mockData.bookings.map(b => this.toSummary(b)));
  }

  cancelBooking(id: number): Observable<CancelBookingResponseDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.delete<CancelBookingResponseDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.bookings.cancel(id)}`);
    }
    return of(this.cancelMockBooking(id));
  }

  private getMockSummaries(customerId: number): BookingSummaryDto[] {
    return this.mockData.bookings
      .filter(b => b.customerId === customerId)
      .map(b => this.toSummary(b));
  }

  private getMockEventBookings(eventId: number): BookingSummaryDto[] {
    return this.mockData.bookings
      .filter(b => b.eventId === eventId)
      .map(b => this.toSummary(b));
  }

  private toSummary(b: BookingDto): BookingSummaryDto {
    return {
      bookingId: b.bookingId,
      bookingNumber: b.bookingNumber,
      customerId: b.customerId,
      eventId: b.eventId,
      bookingStatus: b.bookingStatus,
      eventName: b.event?.eventName || 'Event',
      eventDate: b.event?.eventDate,
      startTime: b.event?.startTime,
      venueName: b.event?.venueName || 'Venue',
      posterUrl: b.event?.posterUrl,
      seatCount: b.seats.length,
      hasParking: !!b.parking,
      totalAmount: b.totalAmount,
      holdExpiresAtUtc: b.holdExpiresAtUtc,
      createdAt: b.createdAt
    };
  }

  private createMockBooking(request: CreateBookingRequestDto): BookingDto {
    const event = this.mockData.events.find(e => e.id === request.eventId) || this.mockData.events[0];
    const bookingNumber = 'GTS-' + Math.floor(1000 + Math.random() * 9000);
    const holdExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const newBooking: BookingDto = {
      bookingId: this.mockData.bookings.length + 1,
      bookingNumber,
      customerId: 1,
      eventId: event.id,
      bookingStatus: BookingStatus.Pending,
      holdExpiresAtUtc: holdExpires,
      createdAt: new Date().toISOString(),
      event: {
        eventId: event.id,
        eventName: event.name,
        eventDate: event.eventDate,
        startTime: event.startTime,
        endTime: event.endTime,
        venueName: event.venueName,
        categoryName: event.categoryName,
        posterUrl: event.posterUrl
      },
      seats: request.seats.map((s, idx) => ({
        seatId: s.seatId,
        seatCode: 'P-N-' + (idx + 3 < 10 ? '0' + (idx + 3) : idx + 3),
        rowLabel: 'N',
        seatNumber: idx + 3,
        sectionName: 'Platinum',
        attendeeName: s.attendeeName || 'Guest ' + (idx + 1),
        attendeeType: s.attendeeType,
        priceSnapshot: s.attendeeType === 2 ? 7500 : 15000
      })),
      totalAmount: 33000
    };

    this.mockData.bookings.unshift(newBooking);
    return newBooking;
  }

  private cancelMockBooking(id: number): CancelBookingResponseDto {
    const booking = this.mockData.bookings.find(b => b.bookingId === id);
    if (booking) {
      booking.bookingStatus = BookingStatus.Cancelled;
    }
    return {
      bookingId: id,
      bookingNumber: booking?.bookingNumber || 'BKG-' + id,
      bookingStatus: BookingStatus.Cancelled,
      message: 'Booking cancelled successfully.'
    };
  }
}
