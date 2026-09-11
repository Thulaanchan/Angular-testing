import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingStateService } from '../../../../core/services/bookings/booking-state.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { BookingService } from '../../../../core/services/bookings/booking.service';
import { CreateBookingRequestDto, BookingDto } from '../../../../core/models/bookings/booking.model';
import { AttendeeType } from '../../../../core/models/bookings/attendee-type.model';
import { BookingStepperComponent } from '../../../../shared/components/booking-stepper/booking-stepper.component';
import { LiveBookingSummaryComponent } from '../../../../shared/components/live-booking-summary/live-booking-summary.component';
import { AlertBannerComponent } from '../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-booking-review-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    BookingStepperComponent,
    LiveBookingSummaryComponent,
    AlertBannerComponent
  ],
  templateUrl: './booking-review-page.component.html',
  styleUrls: ['./booking-review-page.component.css']
})
export class BookingReviewPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  bookingState = inject(BookingStateService);
  authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private router = inject(Router);

  reviewForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  ngOnInit(): void {
    if (!this.bookingState.currentState.event || this.bookingState.currentState.selectedSeats.length === 0) {
      this.router.navigate(['/events']);
      return;
    }

    const user = this.authService.currentUserValue;
    const defaultName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Leon Thas';
    const defaultEmail = user?.email || 'leonthas@email.com';
    const defaultPhone = user?.phoneNumber || '+1 (555) 234-5678';

    this.reviewForm = this.fb.group({
      contactName: [defaultName, [Validators.required, Validators.minLength(2)]],
      contactEmail: [defaultEmail, [Validators.required, Validators.email]],
      contactPhone: [defaultPhone, [Validators.required]],
      agreeTerms: [true, [Validators.requiredTrue]],
      attendees: this.fb.array([])
    });

    this.buildAttendeesArray(defaultName);
  }

  get attendeesArray(): FormArray {
    return this.reviewForm.get('attendees') as FormArray;
  }

  buildAttendeesArray(contactName: string): void {
    const seats = this.bookingState.currentState.selectedSeats;
    seats.forEach((seat, idx) => {
      const initialName = seat.attendeeName || (idx === 0 ? contactName : `Guest ${idx + 1}`);
      this.attendeesArray.push(this.fb.group({
        seatId: [seat.seatId],
        seatCode: [seat.seatCode],
        sectionName: [seat.sectionName],
        rowLabel: [seat.rowLabel],
        seatNumber: [seat.seatNumber],
        attendeeType: [seat.attendeeType],
        price: [seat.price],
        attendeeName: [initialName, [Validators.required, Validators.minLength(2)]]
      }));

      this.bookingState.updateAttendeeName(seat.seatId, initialName);
    });
  }

  removeParking(): void {
    this.bookingState.selectParking(null);
  }

  confirmBooking(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      this.errorMessage = 'Please complete all attendee names and accept the Terms of Service.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formVal = this.reviewForm.value;
    const state = this.bookingState.currentState;
    const eventId = Number(state.event?.eventId ?? state.event?.id ?? 1);

    // Sync attendee names to booking state
    formVal.attendees.forEach((att: any) => {
      this.bookingState.updateAttendeeName(att.seatId, att.attendeeName);
    });

    const createReq: CreateBookingRequestDto = {
      eventId: eventId,
      seats: formVal.attendees.map((a: any) => ({
        seatId: a.seatId,
        attendeeType: typeof a.attendeeType === 'string'
          ? (a.attendeeType === 'Child' ? AttendeeType.Child : AttendeeType.Adult)
          : (a.attendeeType || AttendeeType.Adult),
        attendeeName: (a.attendeeName || '').trim()
      })),
      parkingSlotId: state.selectedParking ? (state.selectedParking.slotId ?? state.selectedParking.id) : undefined
    };

    this.bookingService.createBooking(createReq).subscribe({
      next: (booking: BookingDto) => {
        this.isSubmitting = false;
        this.bookingState.setCreatedBooking(booking);
        this.router.navigate(['/booking/payment']);
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 409) {
          const conf = err.error;
          if (conf?.conflictingSeatIds && conf.conflictingSeatIds.length > 0) {
            this.bookingState.handleSeatConflict(conf.conflictingSeatIds);
            this.errorMessage = conf.message || 'One or more of your selected seats was reserved by another guest. Please pick alternative seats.';
          } else if (conf?.conflictingParkingSlotId) {
            this.bookingState.handleParkingConflict(conf.conflictingParkingSlotId);
            this.errorMessage = conf.message || 'The selected parking stall is no longer available. You may select another stall or continue without parking.';
          } else {
            this.errorMessage = conf?.message || 'A booking conflict occurred. Please check your selections.';
          }
        } else if (err.status === 400) {
          this.errorMessage = err.error?.message || 'Invalid booking details. Please verify attendee names and party size.';
        } else if (err.status === 401) {
          this.errorMessage = 'Your session has expired. Please sign in again to complete your booking.';
        } else {
          this.errorMessage = err.error?.message || err.message || 'Failed to create booking. Please try again.';
        }
      }
    });
  }
}
