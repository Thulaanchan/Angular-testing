import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../../../core/services/bookings/booking.service';
import { BookingSummaryDto, BookingDto } from '../../../../../core/models/bookings/booking.model';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-booking-management-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ModalComponent,
    ConfirmationDialogComponent
  ],
  templateUrl: './booking-management-page.component.html',
  styleUrls: ['./booking-management-page.component.css']
})
export class BookingManagementPageComponent implements OnInit {
  private bookingService = inject(BookingService);

  bookings: BookingSummaryDto[] = [];
  filteredBookings: BookingSummaryDto[] = [];
  isLoading = true;

  selectedStatus = 'all';
  searchTerm = '';

  selectedBooking: BookingSummaryDto | null = null;
  showDetailsModal = false;

  showCancelDialog = false;
  isCancelling = false;

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.filter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  filter(): void {
    let list = [...this.bookings];
    if (this.selectedStatus !== 'all') {
      list = list.filter(b => {
        const s = b.status || (b.bookingStatus != null ? String(b.bookingStatus) : '');
        return s.toLowerCase() === this.selectedStatus.toLowerCase();
      });
    }
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(b =>
        (b.bookingReference || b.bookingNumber || '').toLowerCase().includes(q) ||
        (b.customerName || '').toLowerCase().includes(q) ||
        (b.eventTitle || b.eventName || '').toLowerCase().includes(q)
      );
    }
    this.filteredBookings = list;
  }

  viewDetails(b: BookingSummaryDto): void {
    this.selectedBooking = b;
    this.showDetailsModal = true;
  }

  openCancelDialog(b: BookingSummaryDto, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedBooking = b;
    this.showCancelDialog = true;
  }

  confirmCancel(): void {
    if (!this.selectedBooking) return;
    this.isCancelling = true;

    this.bookingService.cancelBooking(this.selectedBooking.bookingId).subscribe({
      next: () => {
        this.isCancelling = false;
        this.showCancelDialog = false;
        this.loadBookings();
      },
      error: () => {
        this.isCancelling = false;
      }
    });
  }
}
