import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardService } from '../../../../core/services/dashboards/dashboard.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { BookingService } from '../../../../core/services/bookings/booking.service';
import { EventService } from '../../../../core/services/events/event.service';
import { CustomerDashboardSummaryDto } from '../../../../core/models/dashboards/dashboard-summary.model';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { AlertBannerComponent } from '../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-customer-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatCardComponent,
    LoadingSpinnerComponent,
    StatusBadgeComponent,
    AlertBannerComponent
  ],
  templateUrl: './customer-dashboard-page.component.html',
  styleUrls: ['./customer-dashboard-page.component.css']
})
export class CustomerDashboardPageComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private bookingService = inject(BookingService);
  private eventService = inject(EventService);
  authService = inject(AuthService);

  summary: CustomerDashboardSummaryDto | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const customerId = this.authService.getCustomerId();

    if (!customerId) {
      this.isLoading = false;
      this.errorMessage = 'Please sign in to access your customer dashboard.';
      return;
    }

    forkJoin({
      summary: this.dashboardService.getCustomerSummary().pipe(
        catchError(() => of({
          upcomingBookingsCount: 0,
          reservedParkingCount: 0,
          recentPaymentsCount: 0,
          unreadNotificationsCount: 0
        }))
      ),
      bookings: this.bookingService.getCustomerBookings(customerId).pipe(
        catchError(() => of([]))
      ),
      events: this.eventService.getEvents({ pageSize: 3 }).pipe(
        catchError(() => of({ items: [], totalCount: 0, page: 1, pageSize: 3, totalPages: 1 }))
      )
    }).subscribe({
      next: ({ summary, bookings, events }) => {
        const upcomingPasses = (bookings || [])
          .filter((b: any) => b.bookingStatus === 1 || b.bookingStatus === 0 || b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Pending')
          .map((b: any) => ({
            bookingId: b.bookingId,
            eventId: b.eventId,
            title: b.eventName || b.eventTitle || 'Event',
            categoryName: b.categoryName || 'Concert',
            eventDate: b.eventDate,
            venueName: b.venueName || 'Venue',
            seatSummary: b.seatSummary || `${b.seatCount || 1} Seat(s)`
          }));

        const recEvents = (events?.items || []).map((e: any) => ({
          eventId: e.id || e.eventId,
          title: e.name || e.title,
          categoryName: e.categoryName,
          eventDate: e.eventDate,
          venueName: e.venueName,
          posterImageUrl: e.posterUrl || e.posterImageUrl,
          baseTicketPrice: e.ticketPrice || e.baseTicketPrice || 0
        }));

        this.summary = {
          ...summary,
          upcomingBookingsCount: summary.upcomingBookingsCount ?? upcomingPasses.length,
          reservedParkingCount: summary.reservedParkingCount ?? 0,
          recentPaymentsCount: summary.recentPaymentsCount ?? 0,
          unreadNotificationsCount: summary.unreadNotificationsCount ?? 0,
          totalBookings: (bookings || []).length,
          activePasses: upcomingPasses.length,
          parkingReservations: summary.reservedParkingCount ?? 0,
          totalSpent: (bookings || []).reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0),
          upcomingEvents: upcomingPasses,
          recommendedEvents: recEvents
        };
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load customer dashboard metrics. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
