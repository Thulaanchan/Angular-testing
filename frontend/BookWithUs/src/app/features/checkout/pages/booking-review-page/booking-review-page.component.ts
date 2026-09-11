import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingStateService } from '../../../../core/services/bookings/booking-state.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { BookingService } from '../../../../core/services/bookings/booking.service';
import { BookingStepperComponent } from '../../../../shared/components/booking-stepper/booking-stepper.component';
import { LiveBookingSummaryComponent } from '../../../../shared/components/live-booking-summary/live-booking-summary.component';
import { AlertBannerComponent } from '../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-booking-review-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    BookingStepperComponent,
    LiveBookingSummaryComponent,
    AlertBannerComponent
  ],
  templateUrl: './booking-review-page.component.html',
  styleUrls: ['./booking-review-page.component.css']
})
export class BookingReviewPageComponent implements OnInit {
  bookingState = inject(BookingStateService);
  authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private router = inject(Router);

  contactName = '';
  contactEmail = '';
  contactPhone = '';
  agreeTerms = true;

  attendeeNames: { [seatId: number]: string } = {};
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    this.contactName = user?.fullName || 'Leon Thas';
    this.contactEmail = user?.email || 'leonthas@email.com';
    this.contactPhone = user?.phoneNumber || '+1 (555) 234-5678';

    // Populate attendee names default
    const seats = this.bookingState.currentState.selectedSeats;
    seats.forEach((seat, idx) => {
      this.attendeeNames[seat.seatId] = seat.attendeeName || (idx === 0 ? this.contactName : `Guest ${idx + 1}`);
      this.bookingState.updateAttendeeName(seat.seatId, this.attendeeNames[seat.seatId]);
    });
  }

  onAttendeeNameChange(seatId: number, name: string): void {
    this.attendeeNames[seatId] = name;
    this.bookingState.updateAttendeeName(seatId, name);
  }

  proceedToPayment(): void {
    if (!this.agreeTerms) {
      this.errorMessage = 'Please accept the Terms of Service to proceed to payment.';
      return;
    }

    // Save attendee names to state
    Object.keys(this.attendeeNames).forEach(k => {
      this.bookingState.updateAttendeeName(Number(k), this.attendeeNames[Number(k)]);
    });

    this.router.navigate(['/booking/payment']);
  }
}
