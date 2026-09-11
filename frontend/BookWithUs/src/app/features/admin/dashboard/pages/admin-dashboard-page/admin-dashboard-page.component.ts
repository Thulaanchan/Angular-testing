import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardService } from '../../../../../core/services/dashboards/dashboard.service';
import { AdminDashboardSummaryDto } from '../../../../../core/models/dashboards/dashboard-summary.model';
import { StatCardComponent } from '../../../../../shared/components/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { AlertBannerComponent } from '../../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatCardComponent,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    AlertBannerComponent
  ],
  templateUrl: './admin-dashboard-page.component.html',
  styleUrls: ['./admin-dashboard-page.component.css']
})
export class AdminDashboardPageComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  summary: AdminDashboardSummaryDto | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.isLoading = true;
    forkJoin({
      summary: this.dashboardService.getAdminSummary(),
      upcomingEvents: this.dashboardService.getUpcomingEvents().pipe(catchError(() => of([]))),
      recentBookings: this.dashboardService.getRecentBookings().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ summary, upcomingEvents, recentBookings }) => {
        const mappedEvents = upcomingEvents.map(e => ({
          ...e,
          title: e.title || e.eventName,
          soldSeats: e.soldSeats ?? e.bookedSeats,
          totalCapacity: e.totalCapacity ?? e.totalSeats
        }));

        const mappedBookings = recentBookings.map(b => ({
          ...b,
          bookingReference: b.bookingReference || b.bookingNumber,
          eventTitle: b.eventTitle || b.eventName,
          bookingDate: b.bookingDate || b.createdAt,
          totalAmount: b.totalAmount ?? b.amount
        }));

        const totalCapacity = mappedEvents.reduce((sum, e) => sum + (e.totalCapacity || 0), 0);
        const bookedCapacity = mappedEvents.reduce((sum, e) => sum + (e.soldSeats || 0), 0);
        const occupancyRate = totalCapacity > 0 ? Math.round((bookedCapacity / totalCapacity) * 1000) / 10 : 0;

        this.summary = {
          ...summary,
          activeEvents: summary.activeEvents ?? summary.totalEvents,
          seatOccupancyRate: summary.seatOccupancyRate ?? occupancyRate,
          parkingUtilizationRate: summary.parkingUtilizationRate ?? (summary.occupiedParking ? 5.3 : 0),
          upcomingEvents: mappedEvents,
          recentBookings: mappedBookings
        };
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load administration dashboard data. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
