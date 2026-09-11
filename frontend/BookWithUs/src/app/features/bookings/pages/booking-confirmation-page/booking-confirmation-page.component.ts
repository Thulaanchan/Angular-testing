import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { BookingService } from '../../../../core/services/bookings/booking.service';
import { BookingStateService } from '../../../../core/services/bookings/booking-state.service';
import { BookingDto } from '../../../../core/models/bookings/booking.model';
import { BookingStepperComponent } from '../../../../shared/components/booking-stepper/booking-stepper.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-booking-confirmation-page',
  standalone: true,
  imports: [CommonModule, RouterModule, BookingStepperComponent, LoadingSpinnerComponent],
  templateUrl: './booking-confirmation-page.component.html',
  styleUrls: ['./booking-confirmation-page.component.css']
})
export class BookingConfirmationPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);
  bookingState = inject(BookingStateService);

  booking: BookingDto | null = null;
  isLoading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBooking(Number(id));
    } else if (this.bookingState.currentState.createdBooking) {
      this.booking = this.bookingState.currentState.createdBooking;
      this.isLoading = false;
    } else {
      this.loadBooking(1);
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

  getSeatSummary(seats?: any[]): string {
    if (!seats || seats.length === 0) return 'None';
    return seats.map(s => s.seatCode).join(', ');
  }

  printReceipt(): void {
    window.print();
  }
}
