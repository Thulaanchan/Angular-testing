import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../../core/services/bookings/booking.service';
import { BookingSummaryDto } from '../../../../core/models/bookings/booking.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-my-bookings-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ConfirmationDialogComponent
  ],
  templateUrl: './my-bookings-page.component.html',
  styleUrls: ['./my-bookings-page.component.css']
})
export class MyBookingsPageComponent implements OnInit {
  private bookingService = inject(BookingService);
  private router = inject(Router);

  bookings: BookingSummaryDto[] = [];
  filteredBookings: BookingSummaryDto[] = [];
  isLoading = true;

  selectedTab: 'all' | 'confirmed' | 'pending' | 'cancelled' = 'all';
  searchQuery = '';

  // Cancel dialog
  showCancelDialog = false;
  bookingToCancel: BookingSummaryDto | null = null;
  isCancelling = false;

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getCustomerBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.filterBookings();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  setTab(tab: 'all' | 'confirmed' | 'pending' | 'cancelled'): void {
    this.selectedTab = tab;
    this.filterBookings();
  }

  filterBookings(): void {
    let result = [...this.bookings];

    if (this.selectedTab !== 'all') {
      result = result.filter(b => {
        const s = b.status || (b.bookingStatus != null ? String(b.bookingStatus) : '');
        return s.toLowerCase() === this.selectedTab;
      });
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(b =>
        (b.eventTitle || b.eventName || '').toLowerCase().includes(q) ||
        (b.bookingReference || b.bookingNumber || '').toLowerCase().includes(q) ||
        (b.venueName || '').toLowerCase().includes(q)
      );
    }

    this.filteredBookings = result;
  }

  openCancelDialog(booking: BookingSummaryDto, event: MouseEvent): void {
    event.stopPropagation();
    this.bookingToCancel = booking;
    this.showCancelDialog = true;
  }

  confirmCancelBooking(): void {
    if (!this.bookingToCancel) return;
    this.isCancelling = true;

    this.bookingService.cancelBooking(this.bookingToCancel.bookingId).subscribe({
      next: () => {
        this.isCancelling = false;
        this.showCancelDialog = false;
        this.bookingToCancel = null;
        this.loadBookings();
      },
      error: () => {
        this.isCancelling = false;
      }
    });
  }
}
