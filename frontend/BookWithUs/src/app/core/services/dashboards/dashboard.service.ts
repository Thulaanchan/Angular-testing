import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { AdminDashboardSummaryDto, CustomerDashboardSummaryDto, RecentBookingDto, UpcomingEventDto } from '../../models/dashboards/admin-dashboard.model';
import { MockDataService } from '../mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  getAdminSummary(): Observable<AdminDashboardSummaryDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<AdminDashboardSummaryDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.dashboards.adminSummary}`).pipe(
        catchError(() => of(this.getMockAdminSummary()))
      );
    }
    return of(this.getMockAdminSummary());
  }

  getUpcomingEvents(): Observable<UpcomingEventDto[]> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<UpcomingEventDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.dashboards.adminUpcomingEvents}`).pipe(
        catchError(() => of(this.getMockUpcomingEvents()))
      );
    }
    return of(this.getMockUpcomingEvents());
  }

  getRecentBookings(): Observable<RecentBookingDto[]> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<RecentBookingDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.dashboards.adminRecentBookings}`).pipe(
        catchError(() => of(this.getMockRecentBookings()))
      );
    }
    return of(this.getMockRecentBookings());
  }

  getCustomerSummary(): Observable<CustomerDashboardSummaryDto> {
    if (!API_CONFIG.useMockData) {
      return this.http.get<CustomerDashboardSummaryDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.dashboards.customerSummary}`).pipe(
        catchError(() => of(this.getMockCustomerSummary()))
      );
    }
    return of(this.getMockCustomerSummary());
  }

  private getMockAdminSummary(): AdminDashboardSummaryDto {
    return {
      totalEvents: 24,
      totalBookings: 1248,
      availableSeats: 3420,
      occupiedParking: 186,
      totalRevenue: 4850000,
      totalCustomers: 986
    };
  }

  private getMockCustomerSummary(): CustomerDashboardSummaryDto {
    return {
      upcomingBookingsCount: 2,
      reservedParkingCount: 1,
      recentPaymentsCount: 1,
      unreadNotificationsCount: 3,
      totalBookings: 2,
      activePasses: 2,
      parkingReservations: 1,
      totalSpent: 300,
      upcomingEvents: [
        {
          eventId: 1,
          bookingId: 1,
          title: 'Rockstar Aniruth Musical Show - 2026',
          categoryName: 'Concert',
          eventDate: '2026-09-12T18:00:00',
          venueName: 'Unicom TIC, Jaffna',
          seatSummary: 'VIP-A1, VIP-A2 (2 seats)'
        }
      ],
      recommendedEvents: [
        {
          eventId: 1,
          title: 'Rockstar Aniruth Musical Show - 2026',
          categoryName: 'Concerts',
          eventDate: '2026-09-12T18:00:00',
          venueName: 'Unicom TIC, Jaffna',
          baseTicketPrice: 150,
          posterImageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60'
        },
        {
          eventId: 2,
          title: 'Global Tech Summit 2026',
          categoryName: 'Conferences',
          eventDate: '2026-10-15T09:00:00',
          venueName: 'Grand Arena, Colombo',
          baseTicketPrice: 75,
          posterImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'
        },
        {
          eventId: 3,
          title: 'Premier League Finals',
          categoryName: 'Sports',
          eventDate: '2026-11-05T19:00:00',
          venueName: 'National Stadium',
          baseTicketPrice: 90,
          posterImageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60'
        }
      ]
    };
  }

  private getMockUpcomingEvents(): UpcomingEventDto[] {
    return [
      {
        eventId: 1,
        eventName: 'Rockstar Aniruth Musical Show - 2026',
        venueName: 'Unicom TIC, Jaffna',
        eventDate: '2026-09-12',
        startTime: '12:00:00',
        bookingCount: 284,
        totalSeats: 624,
        availableSeats: 340,
        bookedSeats: 284,
        occupancyPercentage: 45.5
      },
      {
        eventId: 2,
        eventName: 'Global AI Summit 2026',
        venueName: 'Cinnamon Life, Colombo',
        eventDate: '2026-10-03',
        startTime: '09:00:00',
        bookingCount: 198,
        totalSeats: 500,
        availableSeats: 302,
        bookedSeats: 198,
        occupancyPercentage: 39.6
      },
      {
        eventId: 3,
        eventName: 'Tamil Cultural Night 2026',
        venueName: 'Jaffna Cultural Centre',
        eventDate: '2026-10-17',
        startTime: '18:00:00',
        bookingCount: 146,
        totalSeats: 360,
        availableSeats: 214,
        bookedSeats: 146,
        occupancyPercentage: 40.5
      }
    ];
  }

  private getMockRecentBookings(): RecentBookingDto[] {
    return [
      {
        bookingId: 1,
        bookingNumber: '#GTS-8829',
        customerName: 'Leo Thas',
        eventName: 'Rockstar Aniruth Musical Show - 2026',
        createdAt: '2026-08-28T14:15:00Z',
        amount: 33000,
        status: 'Confirmed'
      },
      {
        bookingId: 2,
        bookingNumber: '#MOV-4821',
        customerName: 'Anna Lee',
        eventName: 'Titanic',
        createdAt: '2026-08-27T10:00:00Z',
        amount: 4000,
        status: 'Confirmed'
      },
      {
        bookingId: 3,
        bookingNumber: '#UTE-6314',
        customerName: 'John Silva',
        eventName: 'Unicom TIC Startup Expo',
        createdAt: '2026-08-27T11:00:00Z',
        amount: 8500,
        status: 'Pending'
      },
      {
        bookingId: 4,
        bookingNumber: '#TCN-7452',
        customerName: 'Sara Kumar',
        eventName: 'Tamil Cultural Night',
        createdAt: '2026-08-26T16:00:00Z',
        amount: 12300,
        status: 'Confirmed'
      }
    ];
  }
}
