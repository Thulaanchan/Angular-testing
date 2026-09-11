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

  get canCancel(): boolean {
    if (!this.booking) return false;
    const status = this.booking.bookingStatus != null ? this.booking.bookingStatus : (this.booking as any).status;
    return status === 0 || status === 1 || status === '0' || status === '1' ||
           String(status).toLowerCase() === 'pending' || String(status).toLowerCase() === 'confirmed';
  }

  getSeatSummary(seats?: any[]): string {
    if (!seats || seats.length === 0) return 'No seats selected';
    return seats.map(s => s.seatCode).join(', ');
  }

  getVehicleTypeName(vt: any): string {
    if (vt === 1 || vt === '1' || vt === 'ThreeWheeler') return 'Three-Wheeler';
    if (vt === 2 || vt === '2' || vt === 'Car') return 'Car';
    if (vt === 3 || vt === '3' || vt === 'Van') return 'Van';
    if (vt === 4 || vt === '4' || vt === 'Motorbike') return 'Motorbike';
    return String(vt || 'Vehicle');
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
