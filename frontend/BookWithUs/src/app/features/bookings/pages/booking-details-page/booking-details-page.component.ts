import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { BookingService } from '../../../../core/services/bookings/booking.service';
import { PaymentService } from '../../../../core/services/payments/payment.service';
import { BookingDto } from '../../../../core/models/bookings/booking.model';
import { PaymentReceiptDto } from '../../../../core/models/payments/payment-receipt.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-booking-details-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,
    ModalComponent
  ],
  templateUrl: './booking-details-page.component.html',
  styleUrls: ['./booking-details-page.component.css']
})
export class BookingDetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);
  private paymentService = inject(PaymentService);

  booking: BookingDto | null = null;
  receipt: PaymentReceiptDto | null = null;
  isLoading = true;

  showCancelDialog = false;
  isCancelling = false;
  showReceiptModal = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBooking(Number(id));
    }
  }

  loadBooking(id: number): void {
    this.isLoading = true;
    this.bookingService.getBookingById(id).subscribe({
      next: (data) => {
        this.booking = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openReceipt(): void {
    if (!this.booking) return;
    this.paymentService.getReceipt(this.booking.bookingId).subscribe({
      next: (receipt) => {
        this.receipt = receipt;
        this.showReceiptModal = true;
      },
      error: () => {
        // Fallback or navigate directly
        this.router.navigate(['/receipt', this.booking?.bookingId]);
      }
    });
  }

  printReceipt(): void {
    window.print();
  }

  confirmCancel(): void {
    if (!this.booking) return;
    this.isCancelling = true;
    this.bookingService.cancelBooking(this.booking.bookingId).subscribe({
      next: () => {
        this.isCancelling = false;
        this.showCancelDialog = false;
        this.loadBooking(this.booking!.bookingId);
      },
      error: () => {
        this.isCancelling = false;
      }
    });
  }
}
